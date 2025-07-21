'use server'

import { prisma } from '@/lib/prisma'
import type { CoreStrategyFormData, CoreStrategyWithDetails } from './types'
import type { Prisma } from '@/generated/prisma/client'

export interface GetCoreStrategiesParams {
  page?: number
  pageSize?: number
  search?: string
  levelId?: number | 'all'
}

export interface GetCoreStrategiesResult {
  strategies: CoreStrategyWithDetails[]
  total: number
  page: number
  pageSize: number
}

export async function getCoreStrategies(
  params: GetCoreStrategiesParams = {}
): Promise<GetCoreStrategiesResult> {
  try {
    const { page = 1, pageSize = 10, search = '', levelId = 'all' } = params

    // 构建where条件
    const where: Prisma.CoreStrategyWhereInput = {}

    // 添加搜索条件
    if (search.trim()) {
      where.OR = [
        {
          name: {
            contains: search.trim(),
          },
        },
        {
          level: {
            name: {
              contains: search.trim(),
            },
          },
        },
        {
          actions: {
            some: {
              content: {
                contains: search.trim(),
              },
            },
          },
        },
      ]
    }

    // 添加等级筛选条件
    if (levelId !== 'all') {
      where.levelId = levelId
    }

    // 获取总数
    const total = await prisma.coreStrategy.count({ where })

    // 获取分页数据
    const strategies = await prisma.coreStrategy.findMany({
      where,
      include: {
        level: true,
        actions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: [
        {
          level: {
            level: 'asc',
          },
        },
        {
          order: 'asc',
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return {
      strategies,
      total,
      page,
      pageSize,
    }
  } catch (error) {
    console.error('获取核心策略失败:', error)
    throw error
  }
}

export async function getMaturityLevels() {
  try {
    const levels = await prisma.maturityLevel.findMany({
      orderBy: {
        level: 'asc',
      },
    })
    return levels
  } catch (error) {
    console.error('获取成熟度等级失败:', error)
    throw error
  }
}

export async function createCoreStrategy(data: CoreStrategyFormData) {
  try {
    const { actions, ...strategyData } = data

    // 创建策略
    const strategy = await prisma.coreStrategy.create({
      data: {
        name: strategyData.name,
        levelId: strategyData.levelId,
        order: strategyData.order,
        actions: {
          create: actions.map((action) => ({
            content: action.content,
            order: action.order,
          })),
        },
      },
      include: {
        level: true,
        actions: true,
      },
    })

    return strategy
  } catch (error) {
    console.error('创建核心策略失败:', error)
    throw error
  }
}

export async function updateCoreStrategy(
  id: number,
  data: CoreStrategyFormData
) {
  try {
    const { actions, ...strategyData } = data

    // 更新策略基本信息
    await prisma.coreStrategy.update({
      where: { id },
      data: {
        name: strategyData.name,
        levelId: strategyData.levelId,
        order: strategyData.order,
      },
    })

    // 删除所有现有的行动点
    await prisma.coreStrategyAction.deleteMany({
      where: { strategyId: id },
    })

    // 创建新的行动点
    await prisma.coreStrategyAction.createMany({
      data: actions.map((action) => ({
        content: action.content,
        order: action.order,
        strategyId: id,
      })),
    })

    // 获取更新后的完整数据
    const updatedStrategy = await prisma.coreStrategy.findUnique({
      where: { id },
      include: {
        level: true,
        actions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    return updatedStrategy
  } catch (error) {
    console.error('更新核心策略失败:', error)
    throw error
  }
}

export async function deleteCoreStrategy(id: number) {
  try {
    // 删除策略（会级联删除相关的行动点）
    await prisma.coreStrategy.delete({
      where: { id },
    })
  } catch (error) {
    console.error('删除核心策略失败:', error)
    throw error
  }
}
