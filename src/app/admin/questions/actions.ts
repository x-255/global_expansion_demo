'use server'

import { prisma } from '@/lib/prisma'
import type { Question as PrismaQuestion, Dimension as PrismaDimension } from '@/generated/prisma/client'

export interface QuestionFormData {
  text: string
  explanation?: string
  dimensionId: number
}

export type QuestionWithDimension = Omit<PrismaQuestion, 'dimension'> & {
  dimension: Pick<PrismaDimension, 'id' | 'name' | 'deleted'>
}

export async function getQuestions(): Promise<QuestionWithDimension[]> {
  const questions = await prisma.question.findMany({
    where: {
      deleted: false
    },
    include: {
      dimension: true
    },
    orderBy: {
      id: 'asc'
    }
  })
  return questions.filter(q => !q.dimension.deleted)
}

export async function createQuestion(data: QuestionFormData): Promise<PrismaQuestion> {
  const question = await prisma.question.create({
    data: {
      text: data.text,
      explanation: data.explanation,
      dimensionId: data.dimensionId
    }
  })
  return question
}

export async function updateQuestion(id: number, data: QuestionFormData): Promise<PrismaQuestion> {
  const question = await prisma.question.findFirst({
    where: {
      id,
      deleted: false
    }
  })

  if (!question) {
    throw new Error('问题不存在或已被删除')
  }

  return await prisma.question.update({
    where: { id },
    data: {
      text: data.text,
      explanation: data.explanation,
      dimensionId: data.dimensionId
    }
  })
}

export async function deleteQuestion(id: number): Promise<void> {
  const question = await prisma.question.findFirst({
    where: {
      id,
      deleted: false
    }
  })

  if (!question) {
    throw new Error('问题不存在或已被删除')
  }

  await prisma.question.update({
    where: { id },
    data: {
      deleted: true
    }
  })
} 