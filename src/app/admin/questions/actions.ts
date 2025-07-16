'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { Question, Dimension } from '@/generated/prisma/client'

export interface QuestionFormData {
  text: string
  explanation: string | null
  dimensionId: number
}

export type QuestionWithDimension = Question & {
  dimension: Dimension
}

export async function getQuestions(): Promise<QuestionWithDimension[]> {
  try {
    const questions = await prisma.question.findMany({
      where: {
        deleted: false,
        dimension: {
          deleted: false,
        },
      },
      include: {
        dimension: true,
      },
      orderBy: {
        id: 'asc',
      },
    })
    return questions
  } catch (error) {
    console.error('获取问题列表失败:', error)
    throw new Error('获取问题列表失败')
  }
}

export async function createQuestion(
  data: QuestionFormData
): Promise<Question> {
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

  const question = await prisma.question.create({
    data: {
      text: data.text,
      explanation: data.explanation,
      dimensionId: data.dimensionId,
      deleted: false,
    },
  })
  revalidatePath('/admin/questions')
  return question
}

export async function updateQuestion(
  id: number,
  data: QuestionFormData
): Promise<Question> {
  const question = await prisma.question.findUnique({
    where: {
      id,
      deleted: false,
    },
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

  const updated = await prisma.question.update({
    where: { id },
    data: {
      text: data.text,
      explanation: data.explanation,
      dimensionId: data.dimensionId,
    },
  })

  revalidatePath('/admin/questions')
  return updated
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
