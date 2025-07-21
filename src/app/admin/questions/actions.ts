'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type {
  Question,
  Dimension,
  QuestionOption,
} from '@/generated/prisma/client'
import type { QuestionFormData } from './types'

export type QuestionWithOptions = Question & {
  dimension: Dimension
  options: QuestionOption[]
}

export interface GetQuestionsParams {
  page?: number
  pageSize?: number
  search?: string
  dimensionId?: number | 'all'
}

export interface GetQuestionsResult {
  questions: QuestionWithOptions[]
  total: number
  page: number
  pageSize: number
}

export async function getQuestions(params: GetQuestionsParams = {}): Promise<GetQuestionsResult> {
  try {
    const { page = 1, pageSize = 10, search = '', dimensionId = 'all' } = params

    // 构建where条件
    const where: {
      deleted: boolean
      dimension: { deleted: boolean }
      text?: { contains: string; mode: 'insensitive' }
      dimensionId?: number
    } = {
      deleted: false,
      dimension: {
        deleted: false,
      },
    }

    // 添加搜索条件
    if (search.trim()) {
      where.text = {
        contains: search.trim(),
        mode: 'insensitive'
      }
    }

    // 添加维度筛选条件
    if (dimensionId !== 'all') {
      where.dimensionId = dimensionId
    }

    // 获取总数
    const total = await prisma.question.count({ where })

    // 获取分页数据
    const questions = await prisma.question.findMany({
      where,
      include: {
        dimension: true,
        options: true,
      },
      orderBy: {
        order: 'asc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return {
      questions,
      total,
      page,
      pageSize,
    }
  } catch (error) {
    console.error('获取问题列表失败:', error)
    throw new Error('获取问题列表失败')
  }
}

export async function createQuestion(
  data: QuestionFormData
): Promise<QuestionWithOptions> {
  // 检查维度是否存在且未被删除
  const dimension = await prisma.dimension.findUnique({
    where: {
      id: data.dimensionId,
      deleted: false,
    },
  })
  if (!dimension) {
    throw new Error('所选维度不存在或已被删除')
  }
  // 创建问题
  const question = await prisma.question.create({
    data: {
      text: data.text,
      dimensionId: data.dimensionId,
      weight: data.weight,
      order: data.order,
      deleted: false,
    },
  })
  // 创建选项
  if (data.options && data.options.length > 0) {
    await prisma.questionOption.createMany({
      data: data.options.map((opt) => ({
        questionId: question.id,
        description: opt.description,
        score: opt.score,
      })),
    })
  }
  revalidatePath('/admin/questions')
  // 返回带options的完整问题
  return prisma.question.findUnique({
    where: { id: question.id },
    include: { dimension: true, options: true },
  }) as Promise<QuestionWithOptions>
}

export async function updateQuestion(
  id: number,
  data: QuestionFormData
): Promise<QuestionWithOptions> {
  const question = await prisma.question.findUnique({
    where: {
      id,
      deleted: false,
    },
    include: { options: true },
  })
  if (!question) {
    throw new Error('问题不存在')
  }
  // 检查新选择的维度是否存在且未被删除
  const dimension = await prisma.dimension.findUnique({
    where: {
      id: data.dimensionId,
      deleted: false,
    },
  })
  if (!dimension) {
    throw new Error('所选维度不存在或已被删除')
  }
  // 更新问题本身
  await prisma.question.update({
    where: { id },
    data: {
      text: data.text,
      dimensionId: data.dimensionId,
      weight: data.weight,
      order: data.order,
    },
  })
  // 先删除原有选项，再插入新选项
  await prisma.questionOption.deleteMany({ where: { questionId: id } })
  if (data.options && data.options.length > 0) {
    await prisma.questionOption.createMany({
      data: data.options.map((opt) => ({
        questionId: id,
        description: opt.description,
        score: opt.score,
      })),
    })
  }
  revalidatePath('/admin/questions')
  // 返回带options的完整问题
  return prisma.question.findUnique({
    where: { id },
    include: { dimension: true, options: true },
  }) as Promise<QuestionWithOptions>
}

export async function deleteQuestion(id: number): Promise<void> {
  const question = await prisma.question.findUnique({
    where: {
      id,
      deleted: false,
    },
  })
  if (!question) {
    throw new Error('问题不存在')
  }
  await prisma.question.update({
    where: { id },
    data: { deleted: true },
  })
  revalidatePath('/admin/questions')
}
