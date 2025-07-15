'use client'
import { useState, useEffect, useCallback } from 'react'
import { getCompanies } from './actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Company } from '@/generated/prisma/client'

interface CompanyWithCount extends Company {
  _count: {
    assessments: number
  }
}

export default function CompaniesPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<CompanyWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [clickedId, setClickedId] = useState<number | null>(null)

  // 使用 useCallback 包装 loadCompanies 函数
  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getCompanies()
      setCompanies(data)
      setLoading(false)
    } catch (error) {
      console.error('加载公司列表失败:', error)
      setError('加载公司列表失败，请稍后重试')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCompanies()
  }, [loadCompanies])

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">公司列表</h1>
      </div>

      <div className="space-y-4">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/admin/companies/${company.id}/assessments`}
            onClick={(e) => handleCompanyClick(e, company.id)}
            className={`block bg-white rounded-lg p-4 hover:bg-gray-50 transition-all border border-gray-100 relative ${
              clickedId === company.id ? 'opacity-70' : ''
            }`}
          >
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">{company.name}</h2>
                <div className="mt-1 text-sm text-gray-500 space-x-3">
                  <span>{company.industry || '未设置行业'}</span>
                  <span>·</span>
                  <span>{company.location || '未设置地区'}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <span className="font-medium text-gray-900">{company._count.assessments}</span>
                <span className="text-gray-500">次评估</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            {clickedId === company.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
} 