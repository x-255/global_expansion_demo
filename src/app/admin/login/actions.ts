'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcrypt'
import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
)

interface LoginData {
  username: string
  password: string
}

export async function login(data: LoginData) {
  const admin = await prisma.admin.findUnique({
    where: { username: data.username }
  })

  if (!admin) {
    throw new Error('用户名或密码错误')
  }

  const isValid = await compare(data.password, admin.password)
  if (!isValid) {
    throw new Error('用户名或密码错误')
  }

  // 生成JWT token
  const token = await new jose.SignJWT({ 
    sub: String(admin.id),
    username: admin.username,
    name: admin.name
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET)

  // 设置cookie
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'admin_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 // 24小时（以秒为单位）
  })

  // 返回一个普通对象
  return {
    success: true,
    data: {
      id: admin.id,
      username: admin.username,
      name: admin.name
    }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'admin_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  })
  
  return {
    success: true
  }
} 