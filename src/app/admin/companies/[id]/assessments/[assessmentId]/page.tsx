import { AssessmentDetail } from './AssessmentDetail'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{
    id: string
    assessmentId: string
  }>
}

interface Answer {
  questionId: number
  answer: number
}

export default async function AssessmentDetailPage({ params }: Props) {
  // 等待参数解析完成
  const resolvedParams = await params

  // 先获取评估记录
  const assessment = await prisma.companyAssessment.findUnique({
    where: {
      id: parseInt(resolvedParams.assessmentId),
    },
  })

  if (!assessment) {
    throw new Error('评估记录不存在')
  }

  // 解析已回答的问题ID
  const answers = JSON.parse(assessment.answers as string) as Answer[]
  const answeredQuestionIds = answers.map((a) => a.questionId)

  // 加载所有维度和相关的问题（包括已删除的）
  const dimensions = await prisma.dimension.findMany({
    include: {
      questions: {
        where: {
          id: {
            in: answeredQuestionIds,
          },
        },
        include: {
          options: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  })

  // 过滤掉没有任何已回答问题的维度
  const filteredDimensions = dimensions.filter((d) => d.questions.length > 0)

  // 计算各维度得分、总分、成熟度等级
  const dimensionScores = filteredDimensions.map((dimension) => {
    const dimensionAnswers = answers.filter((a) =>
      dimension.questions.some((q) => q.id === a.questionId)
    )
    let score = 0
    if (dimensionAnswers.length > 0) {
      let total = 0
      let count = 0
      dimensionAnswers.forEach((a) => {
        const q = dimension.questions.find((q) => q.id === a.questionId)
        if (q) {
          const opt = q.options.find((o) => o.score === a.answer)
          if (opt) {
            total += opt.score
            count++
          }
        }
      })
      if (count > 0) {
        score = Math.round(total / count)
      }
    }
    return {
      dimensionId: dimension.id,
      dimensionName: dimension.name,
      score,
    }
  })
  const totalScore = Math.round(
    dimensionScores.reduce((sum, d) => sum + d.score, 0) /
      (dimensionScores.length || 1)
  )
  const maturityLevels = await prisma.maturityLevel.findMany({
    orderBy: { level: 'asc' },
  })
  const maturityLevel = maturityLevels.find(
    (level) => totalScore >= level.minScore && totalScore <= level.maxScore
  )

  return (
    <AssessmentDetail
      dimensions={filteredDimensions}
      params={resolvedParams}
      answers={answers}
      dimensionScores={dimensionScores}
      totalScore={totalScore}
      maturityLevel={
        maturityLevel
          ? {
              id: maturityLevel.id,
              name: maturityLevel.name,
              level: maturityLevel.level,
            }
          : null
      }
    />
  )
}
