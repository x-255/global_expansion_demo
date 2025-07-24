'use client'

import { useState, useEffect } from 'react'
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
    <div className="container mx-auto px-2 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => {
          // 过滤掉得分为0的维度（表示没有回答）
          const validDimensionScores = assessment.dimensionScores.filter(
            (d) => d.score > 0
          )

          return (
            <div
              key={assessment.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    评估时间：{new Date(assessment.createdAt).toLocaleString()}
                  </h3>
                  <div className="text-2xl font-bold text-primary">
                    {assessment.totalScore}分
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  成熟度等级：{assessment.maturityLevel?.name || '未评级'}
                </div>
                <div className="space-y-2">
                  {validDimensionScores.map((dimension) => (
                    <div
                      key={dimension.dimensionId}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600">
                        {dimension.dimensionName}
                      </span>
                      <span className="font-medium">{dimension.score}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <a
                    href={`/admin/companies/${companyId}/assessments/${assessment.id}`}
                    className="text-primary hover:text-primary-dark cursor-pointer"
                  >
                    点击查看详情 →
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
