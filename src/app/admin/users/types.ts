import type { Admin as PrismaAdmin } from '@/generated/prisma/client'

// 我们使用 Omit 来移除 password 字段，因为它不会从服务器返回
export type Admin = Omit<PrismaAdmin, 'password'>

export interface AdminFormData {
  username: string
  password: string
  name?: string
}
