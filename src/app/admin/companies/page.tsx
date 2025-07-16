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
        <h1 className="text-3xl font-bold text-gray-800">公司列表</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/admin/companies/${company.id}/assessments`}
            onClick={(e) => handleCompanyClick(e, company.id)}
            className={`block bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 relative ${
              clickedId === company.id ? 'opacity-70' : ''
            }`}
          >
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                  <span className="font-medium text-blue-600">{company._count.assessments}</span>
                  <span className="text-blue-500 ml-1">评估</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {company.industry || '未设置行业'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {company.location || '未设置地区'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {company.size || '未设置规模'}
                </div>
              </div>
            </div>
            {clickedId === company.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-xl">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
} 