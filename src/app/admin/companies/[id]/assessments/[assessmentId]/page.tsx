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

  // 转换数据格式以匹配组件期望的类型
  const transformedDimensions = filteredDimensions.map(dimension => ({
    id: dimension.id,
    name: dimension.name,
    description: dimension.description,
    deleted: dimension.deleted,
    questions: dimension.questions.map(question => ({
      id: question.id,
      text: question.text,
      deleted: question.deleted,
      options: question.options.map(option => ({
        id: option.id,
        text: option.description, // 数据库字段是 description，组件期望 text
        score: option.score,
        description: option.description
      }))
    }))
  }))

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
          const opt = q.options.find((o) => o.id === a.answer)
          if (opt) {
            total += opt.score
            count++
          }
        }
      })
      if (count > 0) {
        score = Number((total / count).toFixed(2))
      }
    }
    return {
      dimensionId: dimension.id,
      dimensionName: dimension.name,
      score,
    }
  })

  // 计算总分（所有维度的加权平均分）
  const totalWeight = dimensionScores.reduce((sum, d) => {
    const dimension = filteredDimensions.find((dim) => dim.id === d.dimensionId)
    return sum + (dimension?.weight || 1)
  }, 0)

  const totalScore = Number(
    (
      dimensionScores.reduce((sum, d) => {
        const dimension = filteredDimensions.find(
          (dim) => dim.id === d.dimensionId
        )
        return sum + d.score * (dimension?.weight || 1)
      }, 0) / totalWeight
    ).toFixed(2)
  )
  const maturityLevels = await prisma.maturityLevel.findMany({
    orderBy: { level: 'asc' },
  })
  const maturityLevel = maturityLevels.find(
    (level) => totalScore >= level.minScore && totalScore <= level.maxScore
  )

  return (
    <AssessmentDetail
      dimensions={transformedDimensions}
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
