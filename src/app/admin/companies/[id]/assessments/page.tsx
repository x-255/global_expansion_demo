'use client'
import { useState, useEffect, useCallback } from 'react'
import { getCompanyAssessments } from '../../../companies/actions'
import type { CompanyAssessment } from '@/generated/prisma/client'

interface Props {
  params: {
    id: string
  }
}

export default function CompanyAssessmentsPage({ params }: Props) {
  const [assessments, setAssessments] = useState<CompanyAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAssessments = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getCompanyAssessments(parseInt(params.id, 10))
      setAssessments(data)
      setLoading(false)
    } catch (error) {
      console.error('加载评估记录失败:', error)
      setError('加载评估记录失败，请稍后重试')
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    loadAssessments()
  }, [loadAssessments])

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
      <h1 className="text-2xl font-bold mb-8">评估记录</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="text-gray-600 mb-2">
              评估时间：{new Date(assessment.createdAt).toLocaleString()}
            </div>
            <div className="text-gray-600">
              答题数：{Array.isArray(assessment.answers) ? assessment.answers.length : 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 