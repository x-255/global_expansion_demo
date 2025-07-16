'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCompanyAssessments } from '../../actions'
import type { AssessmentWithScore } from '../../types'

interface Props {
  params: Promise<{
    id: string
  }>
}

export function AssessmentsList({ params }: Props) {
  const [assessments, setAssessments] = useState<AssessmentWithScore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [companyId, setCompanyId] = useState<string>('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedParams = await params
        setCompanyId(resolvedParams.id)
        const data = await getCompanyAssessments(parseInt(resolvedParams.id))
        setAssessments(data)
        setLoading(false)
      } catch (error) {
        console.error('加载评估记录失败:', error)
        setError('加载评估记录失败，请稍后重试')
        setLoading(false)
      }
    }

    loadData()
  }, [params])

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
        <h1 className="text-2xl font-bold">评估记录列表</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <Link
            key={assessment.id}
            href={`/admin/companies/${companyId}/assessments/${assessment.id}`}
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  评估记录 #{assessment.id}
                </h3>
                <p className="text-gray-600">
                  评估时间：{new Date(assessment.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {assessment.totalScore}
                <span className="text-sm text-gray-500 ml-1">分</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {assessment.dimensionScores.map((score) => (
                <div key={score.dimensionId} className="text-center">
                  <div className="text-lg font-semibold text-gray-700">
                    {score.score}
                  </div>
                  <div className="text-sm text-gray-500">
                    {score.dimensionName}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-blue-600 text-sm font-medium">
              点击查看详情 →
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
