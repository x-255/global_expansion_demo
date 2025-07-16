import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
)

// 不需要认证的路径
const publicPaths = ['/admin/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log('当前路径:', pathname)

  // 如果是公开路径，直接放行
  if (publicPaths.includes(pathname)) {
    console.log('公开路径，直接放行')
    return NextResponse.next()
  }

  // 如果是管理后台路径，需要验证登录状态
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value
    console.log('获取到的token:', token ? '存在' : '不存在')

    if (!token) {
      console.log('token不存在，重定向到登录页')
      const response = NextResponse.redirect(
        new URL('/admin/login', request.url)
      )
      console.log('重定向响应:', response)
      return response
    }

    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET)
      console.log('token验证成功:', payload)
      return NextResponse.next()
    } catch (error) {
      // token无效或过期
      console.log('token验证失败:', error)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
