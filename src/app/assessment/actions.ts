'use server'

import { prisma } from '@/lib/prisma'

export async function getDimensions() {
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
      id: 'asc'
    }
  })
  return dimensions
}

export async function getQuestions() {
  const questions = await prisma.question.findMany({
    where: {
      deleted: false,
      dimension: {
        deleted: false
      }
    },
    include: {
      dimension: true
    },
    orderBy: {
      id: 'asc'
    }
  })
  return questions
} 