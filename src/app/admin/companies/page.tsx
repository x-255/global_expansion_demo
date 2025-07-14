'use client'
import { useState, useEffect, useCallback } from 'react'
import { getCompanies } from './actions'
import Link from 'next/link'
import type { Company } from '@/generated/prisma/client'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/admin/companies/${company.id}/assessments`}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
            <p className="text-gray-600">
              查看该公司的评估记录
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
} 