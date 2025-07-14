'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Prisma, Question } from '@/generated/prisma/client'

export interface DimensionFormData {
  name: string
  description: string
}

type DimensionWithQuestions = Prisma.DimensionGetPayload<{
  include: {
    questions: true
  }
}> & {
  questions: Array<Question & { deleted: boolean }>
}

export async function getDimensions(): Promise<DimensionWithQuestions[]> {
  const dimensions = await prisma.dimension.findMany({
    where: {
      deleted: false
    },
    include: {
      questions: {
        where: {
          deleted: false
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return dimensions
}

export async function createDimension(data: DimensionFormData): Promise<DimensionWithQuestions> {
  const dimension = await prisma.dimension.create({
    data: {
      name: data.name,
      description: data.description,
    },
    include: {
      questions: {
        where: {
          deleted: false
        }
      }
    },
  })
  return dimension
}

export async function updateDimension(id: number, data: DimensionFormData): Promise<DimensionWithQuestions> {
  const dimension = await prisma.dimension.findFirst({
    where: {
      id,
      deleted: false
    }
  })

  if (!dimension) {
    throw new Error('维度不存在或已被删除')
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
          deleted: false
        }
      }
    },
  })

  revalidatePath('/admin/dimensions')
  return updated
}

export async function deleteDimension(id: number): Promise<void> {
  const dimension = await prisma.dimension.findFirst({
    where: {
      id,
      deleted: false
    },
    include: {
      questions: {
        where: {
          deleted: false
        }
      }
    }
  })

  if (!dimension) {
    throw new Error('维度不存在或已被删除')
  }

  if (dimension.questions.length > 0) {
    throw new Error('该维度下还有题目，无法删除')
  }

  await prisma.dimension.update({
    where: { id },
    data: {
      deleted: true
    }
  })

  revalidatePath('/admin/dimensions')
} 