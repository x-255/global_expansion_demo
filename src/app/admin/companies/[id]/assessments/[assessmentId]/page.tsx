import { getDimensions } from '@/app/assessment/actions'
import type { Dimension, Question, CompanyAssessment } from '@/generated/prisma/client'
import { AssessmentDetail } from './AssessmentDetail'

interface Props {
  params: Promise<{
    id: string
    assessmentId: string
  }>
}

export default async function AssessmentDetailPage({ params }: Props) {
  // 等待参数解析完成
  const resolvedParams = await params
  
  // 加载维度和题目数据
  const dimensions = await getDimensions()
  
  return <AssessmentDetail dimensions={dimensions} params={resolvedParams} />
} 