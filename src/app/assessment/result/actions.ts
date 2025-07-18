'use server'

import { prisma } from '@/lib/prisma'
import { getDimensions } from '../actions'
import type { QuestionOption } from '@/generated/prisma/client'

// 计算单个维度的得分
function calculateDimensionScore(
  answers: Array<{ questionId: number; answer: number }>,
  dimensionQuestionIds: number[],
  allOptions: QuestionOption[]
) {
  const dimensionAnswers = answers.filter((a) =>
    dimensionQuestionIds.includes(a.questionId)
  )
  if (dimensionAnswers.length === 0) return 0

  let total = 0
  let count = 0
  dimensionAnswers.forEach((answer) => {
    const option = allOptions.find((opt) => opt.id === answer.answer)
    if (option) {
      total += option.score
      count++
    }
  })

  return count === 0 ? 0 : Number((total / count).toFixed(2))
}

// 获取所有维度的平均分
export async function getDimensionsAverageScores() {
  try {
    // 获取所有维度及其问题
    const dimensions = await getDimensions()

    // 获取所有评估记录
    const assessments = await prisma.companyAssessment.findMany({
      select: {
        answers: true,
      },
    })

    // 获取所有选项
    const allOptions = await prisma.questionOption.findMany()

    // 计算每个维度的平均分
    const dimensionAverages = dimensions.map((dimension) => {
      const dimensionQuestionIds = dimension.questions.map((q) => q.id)

      // 计算该维度在所有评估中的总分
      const scores = assessments
        .map((assessment) => {
          let parsedAnswers: Array<{ questionId: number; answer: number }> = []
          try {
            parsedAnswers = JSON.parse(assessment.answers)
          } catch (error) {
            console.error('解析答案失败:', error)
            return 0
          }
          return calculateDimensionScore(
            parsedAnswers,
            dimensionQuestionIds,
            allOptions
          )
        })
        .filter((score) => score > 0) // 过滤掉0分（未答题）的情况

      const averageScore =
        scores.length > 0
          ? Number(
              (
                scores.reduce((sum, score) => sum + score, 0) / scores.length
              ).toFixed(2)
            )
          : 0

      return {
        dimensionId: dimension.id,
        averageScore,
        weight: dimension.weight,
      }
    })

    return dimensionAverages
  } catch (error) {
    console.error('获取维度平均分失败:', error)
    throw error
  }
}

// 根据分数获取成熟度等级
export async function getMaturityLevelByScore(score: number) {
  try {
    const level = await prisma.maturityLevel.findFirst({
      where: {
        AND: [{ minScore: { lte: score } }, { maxScore: { gte: score } }],
      },
      include: {
        strategies: {
          include: {
            actions: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    })
    return level
  } catch (error) {
    console.error('获取成熟度等级失败:', error)
    throw new Error('获取成熟度等级失败')
  }
}

// 根据分数和维度ID获取维度策略
export async function getDimensionStrategyByScore(
  score: number,
  dimensionId: number
) {
  try {
    const level = await prisma.maturityLevel.findFirst({
      where: {
        AND: [{ minScore: { lte: score } }, { maxScore: { gte: score } }],
      },
    })

    if (!level) {
      return null
    }

    const dimensionStrategy = await prisma.dimensionStrategy.findUnique({
      where: {
        dimensionId_levelId: {
          dimensionId: dimensionId,
          levelId: level.id,
        },
      },
      include: {
        actions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    return {
      ...level,
      dimensionStrategy,
    }
  } catch (error) {
    console.error('获取维度策略失败:', error)
    throw new Error('获取维度策略失败')
  }
}
