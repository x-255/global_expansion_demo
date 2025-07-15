'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { hash } from 'bcrypt'
import type { AdminFormData } from './types'

// 获取所有管理员列表
export async function getAdmins() {
  const admins = await prisma.admin.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      username: true,
      name: true,
      createdAt: true,
      updatedAt: true
    }
  })
  return admins
}

// 创建新管理员
export async function createAdmin(data: AdminFormData) {
  const hashedPassword = await hash(data.password, 10)
  
  const admin = await prisma.admin.create({
    data: {
      username: data.username,
      password: hashedPassword,
      name: data.name || null
    }
  })

  revalidatePath('/admin/users')
  return admin
}

// 更新管理员信息
export async function updateAdmin(id: number, data: AdminFormData) {
  interface UpdateData {
    username: string
    name: string | null
    password?: string
  }

  const updateData: UpdateData = {
    username: data.username,
    name: data.name || null
  }

  // 如果提供了新密码，则更新密码
  if (data.password) {
    updateData.password = await hash(data.password, 10)
  }

  const admin = await prisma.admin.update({
    where: { id },
    data: updateData
  })

  revalidatePath('/admin/users')
  return admin
}

// 删除管理员
export async function deleteAdmin(id: number) {
  // 检查是否是最后一个管理员
  const count = await prisma.admin.count()
  if (count <= 1) {
    throw new Error('不能删除最后一个管理员')
  }

  await prisma.admin.delete({
    where: { id }
  })

  revalidatePath('/admin/users')
} 