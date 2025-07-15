'use server'

import { prisma } from '@/lib/prisma'
import { setCompanyCookie } from '@/lib/cookies'

export async function getOrCreateCompany(name: string) {
  if (!name.trim()) {
    throw new Error('公司名称不能为空')
  }

  try {
    // 先尝试查找公司
    let company = await prisma.company.findUnique({
      where: { name: name.trim() }
    })

    // 如果公司不存在，则创建新公司
    if (!company) {
      company = await prisma.company.create({
        data: { name: name.trim() }
      })
    }

    // 设置 cookie
    await setCompanyCookie(company.name)

    return company
  } catch (error) {
    console.error('Error in getOrCreateCompany:', error)
    throw new Error('处理公司信息时出错')
  }
} 