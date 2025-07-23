'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { DimensionFormData, DimensionWithQuestions } from './types'

export async function getDimensions(): Promise<DimensionWithQuestions[]> {
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
        },
        DimensionStrategy: {
          include: {
            level: true,
            actions: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })
    return dimensions
  } catch (error) {
    console.error('获取维度列表失败:', error)
    throw new Error('获取维度列表失败')
  }
}

export async function createDimension(
  data: DimensionFormData
): Promise<DimensionWithQuestions> {
  // 1. 创建维度
  const dimension = await prisma.dimension.create({
    data: {
      name: data.name,
      description: data.description,
      coreCapability: data.coreCapability,
      weight: data.weight,
      order: data.order,
      icon: '📊', // 默认图标
      deleted: false,
    },
  })

  // 2. 创建所有等级的 DimensionStrategy 和对应的 StrategyAction
  for (const desc of data.maturityLevelDescriptions) {
    const dimensionStrategy = await prisma.dimensionStrategy.create({
      data: {
        dimensionId: dimension.id,
        levelId: desc.levelId,
        definition: desc.definition,
      },
    })
    // 批量插入策略与方案
    if (desc.strategies && desc.strategies.length > 0) {
      await prisma.strategyAction.createMany({
        data: desc.strategies.map((content, idx) => ({
          dimensionStrategyId: dimensionStrategy.id,
          dimensionId: dimension.id,
          levelId: desc.levelId,
          content,
          order: idx,
        })),
      })
    }
  }

  revalidatePath('/admin/dimensions')
  // 返回带完整信息的维度
  return getDimensions().then(
    (list) => list.find((d) => d.id === dimension.id)!
  )
}

export async function updateDimension(
  id: number,
  data: DimensionFormData
): Promise<DimensionWithQuestions> {
  // 1. 检查维度是否存在
  const dimension = await prisma.dimension.findUnique({
    where: { id, deleted: false },
  })
  if (!dimension) {
    throw new Error('维度不存在')
  }

  // 2. 删除原有的 DimensionStrategy 及其下的 StrategyAction
  const oldStrategies = await prisma.dimensionStrategy.findMany({
    where: { dimensionId: id },
    select: { id: true },
  })
  const oldStrategyIds = oldStrategies.map((s) => s.id)
  if (oldStrategyIds.length > 0) {
    await prisma.strategyAction.deleteMany({
      where: { dimensionStrategyId: { in: oldStrategyIds } },
    })
    await prisma.dimensionStrategy.deleteMany({
      where: { id: { in: oldStrategyIds } },
    })
  }

  // 3. 更新维度本身
  await prisma.dimension.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      coreCapability: data.coreCapability,
      weight: data.weight,
      order: data.order,
      icon: '📊', // 保持默认图标
    },
  })

  // 4. 重新插入所有等级的 DimensionStrategy 和对应的 StrategyAction
  for (const desc of data.maturityLevelDescriptions) {
    const dimensionStrategy = await prisma.dimensionStrategy.create({
      data: {
        dimensionId: id,
        levelId: desc.levelId,
        definition: desc.definition,
      },
    })
    if (desc.strategies && desc.strategies.length > 0) {
      await prisma.strategyAction.createMany({
        data: desc.strategies.map((content, idx) => ({
          dimensionStrategyId: dimensionStrategy.id,
          dimensionId: id,
          levelId: desc.levelId,
          content,
          order: idx,
        })),
      })
    }
  }

  revalidatePath('/admin/dimensions')
  // 返回带完整信息的维度
  return getDimensions().then((list) => list.find((d) => d.id === id)!)
}

export async function deleteDimension(id: number): Promise<void> {
  const dimension = await prisma.dimension.findUnique({
    where: {
      id,
      deleted: false,
    },
    include: {
      questions: {
        where: {
          deleted: false,
        },
      },
    },
  })

  if (!dimension) {
    throw new Error('维度不存在')
  }

  if (dimension.questions.length > 0) {
    // 如果有关联的题目，将维度和所有关联的题目都标记为已删除
    await prisma.$transaction([
      prisma.question.updateMany({
        where: { dimensionId: id },
        data: { deleted: true },
      }),
      prisma.dimension.update({
        where: { id },
        data: { deleted: true },
      }),
    ])
  } else {
    // 如果没有关联的题目，只标记维度为已删除
    await prisma.dimension.update({
      where: { id },
      data: { deleted: true },
    })
  }

  revalidatePath('/admin/dimensions')
}
