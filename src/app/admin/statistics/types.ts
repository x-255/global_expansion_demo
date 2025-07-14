export interface StatisticsSummary {
  totalCompanies: number
  totalAssessments: number
  averageScore: number
  industryDistribution: Array<{
    industry: string
    count: number
  }>
  scoreDistribution: Array<{
    range: string
    count: number
  }>
  dimensionScores: Array<{
    dimensionId: number
    dimensionName: string
    averageScore: number
  }>
  monthlyTrend: Array<{
    month: string
    assessmentCount: number
    averageScore: number
  }>
} 