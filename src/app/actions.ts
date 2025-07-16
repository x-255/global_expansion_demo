'use server'

import { prisma } from '@/lib/prisma'
import { setCompanyCookie } from '@/lib/cookies'

export async function getOrCreateCompany(name: string) {
  if (!name.trim()) {
    throw new Error('公司名称不能为空')
  }

  const trimmedName = name.trim()

  try {
    // 先尝试查找公司
    let company = await prisma.company.findFirst({
      where: { name: trimmedName },
    })

    // 如果公司不存在，则创建新公司
    if (!company) {
      try {
        company = await prisma.company.create({
          data: { name: trimmedName },
        })
      } catch (createError) {
        // 如果创建失败，再次尝试查找（处理并发情况）
        company = await prisma.company.findFirst({
          where: { name: trimmedName },
        })

        // 如果还是找不到，则确实是出错了
        if (!company) {
          throw createError
        }
      }
    }

    await setCompanyCookie(company.name)
    return company
  } catch (error) {
    console.error('处理公司信息失败:', error)
    throw new Error('处理公司信息失败')
  }
}
