'use server'

import { prisma } from '@/lib/prisma'
import type { Company, Prisma } from '@/generated/prisma/client'
import type { AssessmentWithScore } from './types'

export interface GetCompaniesParams {
  page?: number
  pageSize?: number
  search?: string
}

export interface GetCompaniesResult {
  companies: Array<Company & { _count: { assessments: number } }>
  total: number
  page: number
  pageSize: number
}

export async function getCompanies(
  params: GetCompaniesParams = {}
): Promise<GetCompaniesResult> {
  const { page = 1, pageSize = 12, search = '' } = params

  // 构建where条件
  const where: Prisma.CompanyWhereInput = {}

  // 添加搜索条件
  if (search.trim()) {
    where.OR = [
      {
        name: {
          contains: search.trim(),
        },
      },
      {
        industry: {
          contains: search.trim(),
        },
      },
      {
        location: {
          contains: search.trim(),
        },
      },
      {
        size: {
          contains: search.trim(),
        },
      },
    ]
  }

  // 获取总数
  const total = await prisma.company.count({ where })

  // 获取分页数据
  const companies = await prisma.company.findMany({
    where,
    include: {
      _count: {
        select: {
          assessments: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  })

  return {
    companies,
    total,
    page,
    pageSize,
  }
}

export async function getCompany(id: number) {
  const company = await prisma.company.findUnique({
    where: {
      id,
    },
  })
  return company
}

export async function createCompany(name: string) {
  const company = await prisma.company.create({
    data: {
      name,
    },
  })
  return company
}

export async function getCompanyAssessments(
  companyId: number
): Promise<AssessmentWithScore[]> {
  try {
    // 获取评估记录
    const assessments = await prisma.companyAssessment.findMany({
      where: { companyId },
      include: {
        company: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // 获取所有题目和选项
    const allQuestions = await prisma.question.findMany({
      include: { options: true },
    })
    // 获取所有维度
    const dimensions = await prisma.dimension.findMany({
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    })
    // 获取所有成熟度等级
    const maturityLevels = await prisma.maturityLevel.findMany({
      orderBy: { level: 'asc' },
    })

    // 计算每个评估的分数
    const assessmentsWithScores: AssessmentWithScore[] = assessments.map(
      (assessment) => {
        // 处理answers字段，确保它是正确的格式
        let answers: Array<{ questionId: number; answer: number }> = []
        if (assessment.answers) {
          try {
            if (typeof assessment.answers === 'object') {
              answers = assessment.answers as Array<{
                questionId: number
                answer: number
              }>
            } else {
              answers = JSON.parse(assessment.answers.toString())
            }
          } catch (error) {
            console.error('解析answers失败:', error)
            answers = []
          }
        }

        // 计算每个维度的得分
        const dimensionScores = dimensions.map((dimension) => {
          const dimensionQuestions = dimension.questions
          const dimensionAnswers = answers.filter((a) =>
            dimensionQuestions.some((q) => q.id === a.questionId)
          )

          let score = 0
          if (dimensionAnswers.length > 0) {
            let total = 0
            let count = 0
            dimensionAnswers.forEach((a) => {
              const q = allQuestions.find((q) => q.id === a.questionId)
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
          const dimension = dimensions.find((dim) => dim.id === d.dimensionId)
          return sum + (dimension?.weight || 1)
        }, 0)

        const totalScore = Number(
          (
            dimensionScores.reduce((sum, d) => {
              const dimension = dimensions.find(
                (dim) => dim.id === d.dimensionId
              )
              return sum + d.score * (dimension?.weight || 1)
            }, 0) / totalWeight
          ).toFixed(2)
        )

        // 计算成熟度等级
        const maturityLevel = maturityLevels.find(
          (level) =>
            totalScore >= level.minScore && totalScore <= level.maxScore
        )

        return {
          id: assessment.id,
          companyId: assessment.companyId,
          company: assessment.company,
          answers, // 使用解析后的 answers 而不是原始的 assessment.answers
          createdAt: assessment.createdAt,
          updatedAt: assessment.updatedAt,
          dimensionScores,
          totalScore,
          maturityLevel: maturityLevel
            ? {
                id: maturityLevel.id,
                name: maturityLevel.name,
                level: maturityLevel.level,
              }
            : null,
        }
      }
    )

    return assessmentsWithScores
  } catch (error) {
    console.error('获取评估记录失败:', error)
    throw error
  }
}

export interface UpdateCompanyState {
  success?: boolean
  error?: string
}

export async function updateCompany(
  _prevState: void,
  formdata: FormData,
  id?: number
) {
  if (!id) return
  const name = formdata.get('name') as string
  const industry = formdata.get('industry') as string
  const size = formdata.get('size') as string
  const location = formdata.get('location') as string
  await prisma.company.update({
    where: { id },
    data: {
      name,
      industry,
      size,
      location,
    },
  })
}
