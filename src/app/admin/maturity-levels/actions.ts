'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { MaturityLevelFormData } from './types'

export async function getMaturityLevels() {
  try {
    const maturityLevels = await prisma.maturityLevel.findMany({
      orderBy: {
        level: 'asc',
      },
    })
    return maturityLevels
  } catch (error) {
    console.error('获取成熟度等级列表失败:', error)
    throw new Error('获取成熟度等级列表失败')
  }
}

export async function createMaturityLevel(data: MaturityLevelFormData) {
  try {
    const maturityLevel = await prisma.maturityLevel.create({
      data: {
        level: data.level,
        name: data.name,
        description: data.description,
        coreFeatures: data.coreFeatures,
        minScore: data.minScore,
        maxScore: data.maxScore,
      },
    })
    revalidatePath('/admin/maturity-levels')
    return maturityLevel
  } catch (error) {
    console.error('创建成熟度等级失败:', error)
    if (
      error instanceof Error &&
      error.message.includes('UNIQUE constraint failed')
    ) {
      throw new Error('等级数值已存在，请使用其他数值')
    }
    throw new Error('创建成熟度等级失败')
  }
}

export async function updateMaturityLevel(
  id: number,
  data: MaturityLevelFormData
) {
  try {
    const existingLevel = await prisma.maturityLevel.findUnique({
      where: { id },
    })

    if (!existingLevel) {
      throw new Error('成熟度等级不存在')
    }

    const updated = await prisma.maturityLevel.update({
      where: { id },
      data: {
        level: data.level,
        name: data.name,
        description: data.description,
        coreFeatures: data.coreFeatures,
        minScore: data.minScore,
        maxScore: data.maxScore,
      },
    })

    revalidatePath('/admin/maturity-levels')
    return updated
  } catch (error) {
    console.error('更新成熟度等级失败:', error)
    if (
      error instanceof Error &&
      error.message.includes('UNIQUE constraint failed')
    ) {
      throw new Error('等级数值已存在，请使用其他数值')
    }
    throw new Error('更新成熟度等级失败')
  }
}

export async function deleteMaturityLevel(id: number): Promise<void> {
  try {
    const maturityLevel = await prisma.maturityLevel.findUnique({
      where: { id },
    })

    if (!maturityLevel) {
      throw new Error('成熟度等级不存在')
    }

    await prisma.maturityLevel.delete({
      where: { id },
    })

    revalidatePath('/admin/maturity-levels')
  } catch (error) {
    console.error('删除成熟度等级失败:', error)
    throw new Error('删除成熟度等级失败')
  }
}
