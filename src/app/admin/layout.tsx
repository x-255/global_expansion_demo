'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { logout } from './login/actions'

const navigation = [
  { name: '企业管理', href: '/admin/companies' },
  { name: '维度管理', href: '/admin/dimensions' },
  { name: '问题管理', href: '/admin/questions' },
  { name: '成熟度等级', href: '/admin/maturity-levels' },
  { name: '核心策略', href: '/admin/core-strategies' },
  { name: '用户管理', href: '/admin/users' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    if (!confirm('确定要退出登录吗？')) {
      return
    }

    setLoading(true)
    try {
      await logout()
      // 使用 replace 而不是 push，这样用户不能通过浏览器的后退按钮回到之前的页面
      router.replace('/admin/login')
    } catch (error) {
      console.error('退出登录失败:', error)
      alert('退出登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 如果是登录页面，直接返回内容
  if (pathname === '/admin/login') {
    return children
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">管理后台</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-full hover:bg-blue-500 lg:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="mt-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 hover:bg-gray-100 ${
                  isActive ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                <span className="mr-3">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* 主内容区 */}
      <div
        className={`lg:pl-64 transition-all duration-300 ${
          isSidebarOpen ? 'pl-64' : 'pl-0'
        }`}
      >
        {/* 顶部栏 */}
        <div className="sticky top-0 z-20 flex items-center justify-between h-16 bg-white shadow-sm px-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 rounded-md hover:bg-gray-100 lg:hidden ${
              isSidebarOpen ? 'hidden' : ''
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* 登出按钮 */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="ml-auto flex items-center px-3 py-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {loading ? '退出中...' : '退出登录'}
          </button>
        </div>

        {/* 页面内容 */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}
