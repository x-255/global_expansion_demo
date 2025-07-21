'use client'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Pagination } from '../../components/Pagination'
import { getCompanies, type GetCompaniesResult } from './actions'
import { CompaniesCards } from './components/CompaniesCards'
import { CompaniesTable } from './components/CompaniesTable'

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">公司列表</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          {/* 搜索框 */}
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="搜索公司..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // 重置页码
              }}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
          </div>

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

      {/* 搜索结果统计和分页信息 */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-600">
        <div>
          共 {total} 个公司
          {total > 0 && (
            <span className="ml-2 text-gray-500">
              | 显示第 {(currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, total)} 条
            </span>
          )}
        </div>
        {Math.ceil(total / PAGE_SIZE) > 1 && (
          <div className="text-gray-500">
            第 {currentPage} 页，共 {Math.ceil(total / PAGE_SIZE)} 页
          </div>
        )}
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
          clickedId={clickedId}
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
