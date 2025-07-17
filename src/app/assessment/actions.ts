'use server'

import { prisma } from '@/lib/prisma'

export async function getDimensions() {
  const dimensions = await prisma.dimension.findMany({
    where: {
      deleted: false,
      questions: {
        some: {
          deleted: false,
        },
      },
    },
    include: {
      questions: {
        where: {
          deleted: false,
        },
        include: {
          options: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  })
  return dimensions
}

export async function getQuestions() {
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
}

export async function validateCompany(name: string) {
  if (!name) return null

  const company = await prisma.company.findFirst({
    where: { name: name.trim() },
  })

  return company
}

export async function saveAssessment(
  companyName: string,
  answers: Array<{ questionId: number; answer: number }>
) {
  try {
    // 获取公司信息
    const company = await prisma.company.findFirst({
      where: { name: companyName },
    })

    if (!company) {
      throw new Error('未找到公司信息')
    }

    // 过滤掉未回答的问题
    const validAnswers = answers.filter((item) => item.answer !== null)

    // 创建评估记录
    const assessment = await prisma.companyAssessment.create({
      data: {
        companyId: company.id,
        answers: JSON.stringify(validAnswers),
      },
    })

    return assessment
  } catch (error) {
    console.error('保存评估结果失败:', error)
    throw new Error('保存评估结果失败')
  }
}
