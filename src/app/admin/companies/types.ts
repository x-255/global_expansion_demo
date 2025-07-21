import type {
  Company as PrismaCompany,
  CompanyAssessment as PrismaCompanyAssessment,
} from '@/generated/prisma/client'

export type Company = PrismaCompany

export interface CompanyAssessment
  extends Omit<PrismaCompanyAssessment, 'answers'> {
  company: Omit<Company, 'assessments'>
  answers: Array<{
    questionId: number
    answer: number
  }>
}

export interface AssessmentWithScore
  extends Omit<CompanyAssessment, 'company'> {
  company: Omit<Company, 'assessments'>
  totalScore: number
  dimensionScores: Array<{
    dimensionId: number
    dimensionName: string
    score: number
  }>
  maturityLevel: {
    id: number
    name: string
    level: number
  } | null
}
