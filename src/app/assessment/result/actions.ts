'use server'

import { prisma } from '@/lib/prisma'
import { getDimensions } from '../actions'

// 计算单个维度的得分
function calculateDimensionScore(
  answers: Array<{ questionId: number; answer: number }>,
  dimensionQuestionIds: number[]
) {
  const dimensionAnswers = answers.filter((a) =>
    dimensionQuestionIds.includes(a.questionId)
  )
  if (dimensionAnswers.length === 0) return 0

  const totalScore = dimensionAnswers.reduce((sum, answer) => {
    // 将0-4的选项转换为0-100的分数
    return sum + (answer.answer / 4) * 100
  }, 0)

  return Math.round(totalScore / dimensionAnswers.length)
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
          return calculateDimensionScore(parsedAnswers, dimensionQuestionIds)
        })
        .filter((score) => score > 0) // 过滤掉0分（未答题）的情况

      const averageScore =
        scores.length > 0
          ? Math.round(
              scores.reduce((sum, score) => sum + score, 0) / scores.length
            )
          : 0

      return {
        dimensionId: dimension.id,
        averageScore,
      }
    })

    return dimensionAverages
  } catch (error) {
    console.error('计算维度平均分失败:', error)
    throw new Error('计算维度平均分失败')
  }
}
