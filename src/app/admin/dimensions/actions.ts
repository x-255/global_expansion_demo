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
      },
      orderBy: {
        createdAt: 'desc',
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
  const dimension = await prisma.dimension.create({
    data: {
      name: data.name,
      description: data.description,
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
  return dimension
}

export async function updateDimension(
  id: number,
  data: DimensionFormData
): Promise<DimensionWithQuestions> {
  const dimension = await prisma.dimension.findUnique({
    where: {
      id,
      deleted: false,
    },
  })

  if (!dimension) {
    throw new Error('维度不存在')
  }

  const updated = await prisma.dimension.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
    include: {
      questions: {
        where: {
          deleted: false,
        },
      },
    },
  })

  revalidatePath('/admin/dimensions')
  return updated
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
