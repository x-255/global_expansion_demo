'use server'

import { prisma } from '@/lib/prisma'
import type { MaturityLevel, Dimension } from '@/generated/prisma/client'

export interface ModelFrameworkData {
  maturityLevels: MaturityLevel[]
  dimensions: Dimension[]
}

// 获取模型框架数据（成熟度等级和维度）
export async function getModelFrameworkData(): Promise<ModelFrameworkData> {
  try {
    // 获取成熟度等级
    const maturityLevels = await prisma.maturityLevel.findMany({
      orderBy: {
        level: 'asc',
      },
    })

    // 获取维度
    const dimensions = await prisma.dimension.findMany({
      where: {
        deleted: false,
      },
      orderBy: {
        order: 'asc',
      },
    })

    return {
      maturityLevels,
      dimensions,
    }
  } catch (error) {
    console.error('获取模型框架数据失败:', error)
    throw new Error('获取模型框架数据失败')
  }
}
