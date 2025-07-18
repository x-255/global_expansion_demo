export interface Company {
  id: number
  name: string
  industry: string | null
  size: string | null
  location: string | null
  assessments: CompanyAssessment[]
  createdAt: Date
  updatedAt: Date
}

export interface CompanyAssessment {
  id: number
  companyId: number
  company: Omit<Company, 'assessments'>
  answers: Array<{
    questionId: number
    answer: number // optionId of the selected answer
  }>
  createdAt: Date
  updatedAt: Date
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
