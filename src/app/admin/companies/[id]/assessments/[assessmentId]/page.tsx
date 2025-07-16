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
      id: parseInt(resolvedParams.assessmentId)
    }
  })

  if (!assessment) {
    throw new Error('评估记录不存在')
  }

  // 解析已回答的问题ID
  const answers = JSON.parse(assessment.answers as string) as Answer[]
  const answeredQuestionIds = answers.map(a => a.questionId)

  // 加载所有维度和相关的问题（包括已删除的）
  const dimensions = await prisma.dimension.findMany({
    include: {
      questions: {
        where: {
          id: {
            in: answeredQuestionIds
          }
        }
      }
    },
    orderBy: {
      id: 'asc'
    }
  })

  // 过滤掉没有任何已回答问题的维度
  const filteredDimensions = dimensions.filter(d => d.questions.length > 0)
  
  return <AssessmentDetail dimensions={filteredDimensions} params={resolvedParams} />
} 