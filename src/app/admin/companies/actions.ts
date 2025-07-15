'use server'

import { prisma } from '@/lib/prisma'
import type { AssessmentWithScore } from './types'

export async function getCompanies() {
  const companies = await prisma.company.findMany({
    include: {
      _count: {
        select: {
          assessments: true
        }
      }
    },
    orderBy: {
      id: 'asc'
    }
  })
  return companies
}

export async function getCompany(id: number) {
  const company = await prisma.company.findUnique({
    where: {
      id
    }
  })
  return company
}

export async function createCompany(name: string) {
  const company = await prisma.company.create({
    data: {
      name
    }
  })
  return company
}

export async function getCompanyAssessments(companyId: number): Promise<AssessmentWithScore[]> {
  try {
    // 获取评估记录
    const assessments = await prisma.companyAssessment.findMany({
      where: { companyId },
      include: {
        company: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // 获取维度和题目数据
    const dimensions = await prisma.dimension.findMany({
      where: { deleted: false },
      include: {
        questions: {
          where: { deleted: false }
        }
      }
    })

    // 计算每个评估的分数
    const assessmentsWithScores: AssessmentWithScore[] = assessments.map(assessment => {
      // 处理answers字段，确保它是正确的格式
      let answers: Array<{ questionId: number; answer: number }> = []
      
      if (assessment.answers) {
        try {
          // 如果answers已经是对象，直接使用
          if (typeof assessment.answers === 'object') {
            answers = assessment.answers as Array<{ questionId: number; answer: number }>
          } else {
            // 如果是字符串，尝试解析
            answers = JSON.parse(assessment.answers.toString())
          }
        } catch (error) {
          console.error('解析answers失败:', error)
          // 解析失败时使用空数组
          answers = []
        }
      }
      
      // 计算每个维度的得分
      const dimensionScores = dimensions.map(dimension => {
        const dimensionQuestions = dimension.questions
        const dimensionAnswers = answers.filter(a => 
          dimensionQuestions.some(q => q.id === a.questionId)
        )

        let score = 0
        if (dimensionAnswers.length > 0) {
          // 将0-4的选项转换为0-100的分数
          score = Math.round(
            (dimensionAnswers.reduce((sum, a) => sum + a.answer, 0) / dimensionAnswers.length / 4) * 100
          )
        }

        return {
          dimensionId: dimension.id,
          dimensionName: dimension.name,
          score
        }
      })

      // 计算总分（所有维度的平均分）
      const totalScore = Math.round(
        dimensionScores.reduce((sum, d) => sum + d.score, 0) / dimensionScores.length
      )

      return {
        id: assessment.id,
        companyId: assessment.companyId,
        answers,
        createdAt: assessment.createdAt,
        updatedAt: assessment.updatedAt,
        company: assessment.company,
        totalScore,
        dimensionScores
      }
    })

    return assessmentsWithScores
  } catch (error) {
    console.error('获取评估记录失败:', error)
    throw new Error('获取评估记录失败')
  }
} 