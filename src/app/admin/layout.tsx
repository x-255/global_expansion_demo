'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { logout } from './login/actions'
import { generateBreadcrumb } from '@/utils/breadcrumb'

const navigation = [
  {
    name: '仪表板',
    href: '/admin',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
        />
      </svg>
    ),
  },
  {
    name: '企业管理',
    href: '/admin/companies',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    name: '维度管理',
    href: '/admin/dimensions',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    name: '问题管理',
    href: '/admin/questions',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    name: '成熟度等级',
    href: '/admin/maturity-levels',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
  {
    name: '核心策略',
    href: '/admin/core-strategies',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    name: '用户管理',
    href: '/admin/users',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
  },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 现代化侧边栏 */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-xl transform transition-all duration-300 ease-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 侧边栏头部 */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">管理后台</h1>
              <p className="text-xs text-slate-500">Global Expansion</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

        {/* 导航菜单 */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-sm">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* 侧边栏底部 */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl p-4 border border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  管理员
                </p>
                <p className="text-xs text-slate-500">在线</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 现代化主内容区 */}
      <div
        className={`lg:pl-72 transition-all duration-300 ${
          isSidebarOpen ? 'pl-72' : 'pl-0'
        }`}
      >
        {/* 现代化顶部栏 */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`p-2 rounded-xl hover:bg-slate-100 transition-colors lg:hidden ${
                  isSidebarOpen ? 'hidden' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* 面包屑导航 */}
              <nav className="hidden md:flex items-center gap-2 text-sm">
                {generateBreadcrumb(pathname).map((item, index, array) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span className="text-slate-800 font-medium">
                        {item.name}
                      </span>
                    )}
                    {index < array.length - 1 && (
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* 登出按钮 */}
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="text-sm font-medium">
                  {loading ? '退出中...' : '退出'}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* 现代化页面内容 */}
        <main className="p-6 space-y-6">{children}</main>
      </div>
    </div>
  )
}
