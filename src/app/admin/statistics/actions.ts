'use server'

import { prisma } from '@/lib/prisma'
import { StatisticsSummary } from './types'
import type { Prisma } from '@/generated/prisma'

type Question = {
  id: number
  text: string
  explanation: string
  dimensionId: number
  createdAt: Date
  updatedAt: Date
}

type Dimension = {
  id: number
  name: string
  description: string
  questions: Question[]
  createdAt: Date
  updatedAt: Date
}

type CompanyAssessment = Prisma.CompanyAssessmentGetPayload<{
  include: {
    company: true
  }
}>

interface AssessmentScore {
  score: number
  company: CompanyAssessment['company']
  createdAt: Date
}

function calculateDimensionScore(questions: Question[], answers: Array<{ questionId: number; answer: number }>) {
  const dimensionAnswers = answers.filter((a) =>
    questions.some((q) => q.id === a.questionId)
  )

  if (dimensionAnswers.length === 0) return 0

  const totalScore = dimensionAnswers.reduce((sum, answer) => {
    return sum + answer.answer
  }, 0)

  return Math.round((totalScore / dimensionAnswers.length) * 100)
}

function calculateTotalScore(dimensions: Dimension[], dimensionScores: number[]) {
  if (dimensions.length === 0) return 0
  return Math.round(dimensionScores.reduce((sum, score) => sum + score, 0) / dimensions.length)
}

export async function getCompanyScores(companyId: number) {
  const assessments = await prisma.companyAssessment.findMany({
    where: { companyId },
    orderBy: { createdAt: 'asc' },
  })

  const dimensions = await prisma.dimension.findMany({
    include: {
      questions: true,
    },
  }) as unknown as Dimension[]

  const scores = assessments.map((assessment) => {
    const answers = assessment.answers ? JSON.parse(assessment.answers.toString()) : []
    const dimensionScores = dimensions.map((dim) =>
      calculateDimensionScore(dim.questions, answers)
    )
    const totalScore = calculateTotalScore(dimensions, dimensionScores)

    return {
      date: assessment.createdAt,
      score: totalScore,
    }
  })

  return scores
}

export async function getIndustryAverageScores() {
  const companies = await prisma.company.findMany({
    include: {
      assessments: true,
    },
  })

  const dimensions = await prisma.dimension.findMany({
    include: {
      questions: true,
    },
  }) as unknown as Dimension[]

  const industryScores = companies.reduce((acc, company) => {
    if (!company.industry || company.assessments.length === 0) return acc

    const latestAssessment = company.assessments[company.assessments.length - 1]
    const answers = latestAssessment.answers ? JSON.parse(latestAssessment.answers.toString()) : []
    const dimensionScores = dimensions.map((dim) =>
      calculateDimensionScore(dim.questions, answers)
    )
    const totalScore = calculateTotalScore(dimensions, dimensionScores)

    if (!acc[company.industry]) {
      acc[company.industry] = {
        totalScore: 0,
        count: 0,
      }
    }

    acc[company.industry].totalScore += totalScore
    acc[company.industry].count++

    return acc
  }, {} as Record<string, { totalScore: number; count: number }>)

  return Object.entries(industryScores).map(([industry, data]) => ({
    industry,
    score: Math.round(data.totalScore / data.count),
  }))
}

export async function getStatisticsSummary(): Promise<StatisticsSummary> {
  // 获取基础统计数据
  const [totalCompanies, totalAssessments] = await Promise.all([
    prisma.company.count(),
    prisma.companyAssessment.count(),
  ])

  // 获取所有维度和题目信息
  const dimensions = await prisma.dimension.findMany({
    include: {
      questions: true,
    },
  }) as unknown as Dimension[]

  // 获取所有评估记录
  const assessments = await prisma.companyAssessment.findMany({
    include: {
      company: true,
    },
  }) as CompanyAssessment[]

  // 计算每个评估的总分
  const assessmentScores: AssessmentScore[] = assessments.map((assessment: CompanyAssessment) => {
    const answers = assessment.answers ? JSON.parse(assessment.answers.toString()) as Array<{ questionId: number; answer: number }> : []
    let totalScore = 0

    dimensions.forEach((dimension: Dimension) => {
      const dimensionQuestions = dimension.questions
      const dimensionAnswers = answers.filter(a => 
        dimensionQuestions.some(q => q.id === a.questionId)
      )

      if (dimensionAnswers.length > 0) {
        const dimensionScore = dimensionAnswers.reduce((sum, answer) => 
          sum + answer.answer, 0) / dimensionAnswers.length
        totalScore += dimensionScore
      }
    })

    // 计算总平均分
    totalScore = dimensions.length > 0 ? totalScore / dimensions.length : 0

    return {
      score: Math.round(totalScore * 100), // 转换为百分制
      company: assessment.company,
      createdAt: assessment.createdAt,
    }
  })

  // 计算平均分
  const averageScore = assessmentScores.length > 0
    ? assessmentScores.reduce((sum: number, item: AssessmentScore) => sum + item.score, 0) / assessmentScores.length
    : 0

  // 计算行业分布
  const industryMap = new Map<string, number>()
  assessmentScores.forEach((item: AssessmentScore) => {
    const industry = item.company.industry || '未知'
    industryMap.set(industry, (industryMap.get(industry) || 0) + 1)
  })
  const industryDistribution = Array.from(industryMap.entries())
    .map(([industry, count]) => ({ industry, count }))
    .sort((a, b) => b.count - a.count)

  // 计算分数分布
  const scoreRanges = [
    { min: 0, max: 20, label: '0-20分' },
    { min: 20, max: 40, label: '20-40分' },
    { min: 40, max: 60, label: '40-60分' },
    { min: 60, max: 80, label: '60-80分' },
    { min: 80, max: 100, label: '80-100分' },
  ]
  const scoreDistribution = scoreRanges.map(range => ({
    range: range.label,
    count: assessmentScores.filter((item: AssessmentScore) => 
      item.score >= range.min && item.score < range.max
    ).length,
  }))

  // 计算维度平均分
  const dimensionScores = dimensions.map((dimension: Dimension) => {
    let totalScore = 0
    let count = 0

    assessments.forEach((assessment: CompanyAssessment) => {
      const answers = assessment.answers ? JSON.parse(assessment.answers.toString()) as Array<{ questionId: number; answer: number }> : []
      const dimensionQuestions = dimension.questions
      const dimensionAnswers = answers.filter(a => 
        dimensionQuestions.some(q => q.id === a.questionId)
      )

      if (dimensionAnswers.length > 0) {
        const score = dimensionAnswers.reduce((sum, answer) => 
          sum + answer.answer, 0) / dimensionAnswers.length
        totalScore += score * 100 // 转换为百分制
        count++
      }
    })

    return {
      dimensionId: dimension.id,
      dimensionName: dimension.name,
      averageScore: count > 0 ? Math.round(totalScore / count) : 0,
    }
  })

  // 计算月度趋势
  const monthlyMap = new Map<string, { count: number; totalScore: number }>()
  assessmentScores.forEach((item: AssessmentScore) => {
    const month = item.createdAt.toISOString().slice(0, 7) // YYYY-MM
    const data = monthlyMap.get(month) || { count: 0, totalScore: 0 }
    data.count++
    data.totalScore += item.score
    monthlyMap.set(month, data)
  })

  const monthlyTrend = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      assessmentCount: data.count,
      averageScore: data.totalScore / data.count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))

  return {
    totalCompanies,
    totalAssessments,
    averageScore,
    industryDistribution,
    scoreDistribution,
    dimensionScores,
    monthlyTrend,
  }
} 