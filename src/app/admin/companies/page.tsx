'use client'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Pagination } from '../../components/Pagination'
import { getCompanies, type GetCompaniesResult } from './actions'
import { CompaniesCards } from './components/CompaniesCards'
import { CompaniesTable } from './components/CompaniesTable'
import { Input } from '@/components/admin'

const PAGE_SIZE = 12

export default function CompaniesPage() {
  const router = useRouter()
  const [companiesData, setCompaniesData] = useState<GetCompaniesResult>({
    companies: [],
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [clickedId, setClickedId] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // 使用 useCallback 包装 loadCompanies 函数
  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getCompanies({
        page: currentPage,
        pageSize: PAGE_SIZE,
        search: searchTerm,
      })
      setCompaniesData(data)
      setLoading(false)
    } catch (error) {
      console.error('加载公司列表失败:', error)
      setError('加载公司列表失败，请稍后重试')
      setLoading(false)
    }
  }, [currentPage, searchTerm])

  useEffect(() => {
    loadCompanies()
  }, [loadCompanies])

  // 从服务端获取的数据
  const { companies, total } = companiesData

  const handleCompanyClick = (e: React.MouseEvent, companyId: number) => {
    e.preventDefault()
    setClickedId(companyId)
    // 预加载下一个页面
    router.prefetch(`/admin/companies/${companyId}/assessments`)
    // 延迟一点点再跳转，让用户看到加载状态
    setTimeout(() => {
      router.push(`/admin/companies/${companyId}/assessments`)
    }, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">企业管理</h1>
          <p className="text-slate-600 mt-2">
            管理所有注册的企业信息和评估数据
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          {/* 搜索框 */}
          <Input
            placeholder="搜索公司名称、行业或地区..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            leftIcon={
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            className="w-full sm:w-80"
          />

          {/* 视图切换按钮 */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="卡片视图"
            >
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="表格视图"
            >
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 根据视图模式显示不同的内容 */}
      {viewMode === 'card' ? (
        <CompaniesCards
          companies={companies}
          clickedId={clickedId}
          onCompanyClick={handleCompanyClick}
        />
      ) : (
        <CompaniesTable
          companies={companies}
          onCompanyUpdated={loadCompanies}
          onCompanyClick={handleCompanyClick}
        />
      )}

      {/* 分页控件 */}
      <Pagination
        currentPage={currentPage}
        total={total}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        className="mt-8"
      />
    </div>
  )
}
