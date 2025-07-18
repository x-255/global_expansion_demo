'use server'

import { prisma } from '@/lib/prisma'
import type { AssessmentWithScore } from './types'

export async function getCompanies() {
  const companies = await prisma.company.findMany({
    include: {
      _count: {
        select: {
          assessments: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  })
  return companies
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
                const opt = q.options.find((o) => o.id === a.answer) // 通过选项ID查找
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

        // 计算总分（所有维度的平均分）
        const totalScore = Math.round(
          dimensionScores.reduce((sum, d) => sum + d.score, 0) /
            (dimensionScores.length || 1)
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
