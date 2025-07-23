'use server'

import { prisma } from '@/lib/prisma'

export interface ModelDimensionData {
  id: number
  name: string
  description: string
  score: number
  maxScore: number
  level: string
  coreCapability: string
  weight: number
}

export interface ModelOverviewData {
  dimensions: ModelDimensionData[]
  overallScore: number
  maturityLevel: string
  totalQuestions: number
  completedAssessments: number
}

// 获取模型维度数据
export async function getModelDimensions(): Promise<ModelDimensionData[]> {
  try {
    const dimensions = await prisma.dimension.findMany({
      where: {
        deleted: false,
      },
      include: {
        questions: {
          where: {
            deleted: false,
          },
          include: {
            options: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    // 获取成熟度等级
    const maturityLevels = await prisma.maturityLevel.findMany({
      orderBy: {
        level: 'asc',
      },
    })

    // 模拟评估数据（实际应用中应该从真实评估结果获取）
    const mockScores = [4.2, 3.8, 4.5, 3.9, 4.1, 3.7] // 对应6个维度的模拟分数

    return dimensions.map((dimension, index) => {
      const score = mockScores[index] || 3.5
      const maxScore = 5.0

      // 根据分数确定成熟度等级
      const level =
        maturityLevels.find(
          (ml) => score >= ml.minScore && score <= ml.maxScore
        )?.name || 'L3（发展级）'

      return {
        id: dimension.id,
        name: dimension.name,
        description: dimension.description || '',
        score,
        maxScore,
        level,
        coreCapability: dimension.coreCapability,
        weight: dimension.weight,
      }
    })
  } catch (error) {
    console.error('获取模型维度数据失败:', error)
    throw new Error('获取模型维度数据失败')
  }
}

// 获取模型概览数据
export async function getModelOverview(): Promise<ModelOverviewData> {
  try {
    const dimensions = await getModelDimensions()

    // 计算加权总分
    const totalWeight = dimensions.reduce((sum, dim) => sum + dim.weight, 0)
    const weightedScore =
      dimensions.reduce((sum, dim) => sum + dim.score * dim.weight, 0) /
      totalWeight

    // 获取成熟度等级
    const maturityLevels = await prisma.maturityLevel.findMany({
      orderBy: {
        level: 'asc',
      },
    })

    const currentLevel =
      maturityLevels.find(
        (ml) => weightedScore >= ml.minScore && weightedScore <= ml.maxScore
      )?.name || 'L3（发展级）'

    // 获取统计数据
    const totalQuestions = await prisma.question.count({
      where: {
        deleted: false,
        dimension: {
          deleted: false,
        },
      },
    })

    const completedAssessments = await prisma.companyAssessment.count()

    return {
      dimensions,
      overallScore: weightedScore,
      maturityLevel: currentLevel,
      totalQuestions,
      completedAssessments,
    }
  } catch (error) {
    console.error('获取模型概览数据失败:', error)
    throw new Error('获取模型概览数据失败')
  }
}

// 转换数据格式用于雷达图
export function transformToRadarData(dimensions: ModelDimensionData[]) {
  return dimensions.map((dim) => ({
    dimension: dim.name,
    score: dim.score,
    maxScore: dim.maxScore,
  }))
}

// 转换数据格式用于能力矩阵
export function transformToCapabilityMatrix(dimensions: ModelDimensionData[]) {
  const colors = [
    '#CC4F3D',
    '#B79F67',
    '#3D5D6F',
    '#8DA7B8',
    '#E61717',
    '#949494',
  ]
  const icons = [
    '/check-circle.svg',
    '/globe.svg',
    '/window.svg',
    '/check-circle.svg',
    '/globe.svg',
    '/window.svg',
  ]

  return dimensions.map((dim, index) => ({
    id: dim.id.toString(),
    name: dim.name,
    description: dim.description || dim.coreCapability,
    score: dim.score,
    maxScore: dim.maxScore,
    level: dim.level,
    icon: icons[index % icons.length],
    color: colors[index % colors.length],
  }))
}

// 转换数据格式用于仪表盘
export function transformToDashboard(dimensions: ModelDimensionData[]) {
  const colors = [
    '#CC4F3D',
    '#B79F67',
    '#3D5D6F',
    '#8DA7B8',
    '#E61717',
    '#949494',
  ]

  return dimensions.map((dim, index) => ({
    id: dim.id.toString(),
    name: dim.name,
    score: dim.score,
    maxScore: dim.maxScore,
    trend:
      Math.random() > 0.5
        ? 'up'
        : ((Math.random() > 0.5 ? 'down' : 'stable') as
            | 'up'
            | 'down'
            | 'stable'),
    change: (Math.random() - 0.5) * 0.4, // -0.2 到 +0.2 的随机变化
    color: colors[index % colors.length],
  }))
}

// 获取企业特定的评估数据（如果有公司ID）
export async function getCompanyModelData(
  companyId?: number
): Promise<ModelOverviewData> {
  try {
    if (!companyId) {
      return await getModelOverview()
    }

    // 获取该公司的最新评估结果
    const latestAssessment = await prisma.companyAssessment.findFirst({
      where: {
        companyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!latestAssessment) {
      return await getModelOverview()
    }

    // 解析评估结果并计算各维度得分
    const answers = JSON.parse(latestAssessment.answers)
    const dimensions = await getModelDimensions()

    // 这里应该根据实际的评估答案计算真实得分
    // 目前使用模拟数据

    // 计算总分（这里应该根据实际的评估答案计算）
    const totalScore = 3.5 // 临时使用默认值

    return {
      dimensions,
      overallScore: totalScore,
      maturityLevel: 'L3（稳健级）', // 临时使用默认值
      totalQuestions: Object.keys(answers).length,
      completedAssessments: 1,
    }
  } catch (error) {
    console.error('获取企业模型数据失败:', error)
    return await getModelOverview()
  }
}
