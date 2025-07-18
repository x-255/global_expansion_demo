'use client'

import { useEffect, useState } from 'react'
import type {
  Dimension,
  Question,
  CompanyAssessment,
} from '@/generated/prisma/client'

interface Props {
  dimensions: any[]
  params: {
    id: string
    assessmentId: string
  }
  answers: Array<{ questionId: number; answer: number }>
  dimensionScores: Array<{
    dimensionId: number
    dimensionName: string
    score: number
  }>
  totalScore: number
  maturityLevel: { id: number; name: string; level: number } | null
}

export function AssessmentDetail({
  dimensions,
  params,
  answers,
  dimensionScores,
  totalScore,
  maturityLevel,
}: Props) {
  const [assessment, setAssessment] = useState<CompanyAssessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        // 加载评估记录
        const assessmentData = await fetch(
          `/api/assessments/${params.assessmentId}`
        ).then((res) => res.json())
        setAssessment(assessmentData)
        setLoading(false)
      } catch (error) {
        console.error('加载数据失败:', error)
        setError('加载数据失败，请稍后重试')
        setLoading(false)
      }
    }
    loadData()
  }, [params.assessmentId])

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">评估记录详情</h1>
        {assessment && (
          <p className="text-gray-600">
            评估时间：{new Date(assessment.createdAt).toLocaleString()}
          </p>
        )}
        <div className="mt-2 flex gap-6 items-center">
          <div className="text-xl font-bold text-blue-700">
            总分：{totalScore}
          </div>
          {maturityLevel && (
            <div className="text-lg font-bold text-green-700">
              成熟度等级：{maturityLevel.name}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {dimensions.map((dimension) => {
          const dimScore = dimensionScores.find(
            (d) => d.dimensionId === dimension.id
          )
          return (
            <div
              key={dimension.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{dimension.name}</h2>
                {dimension.deleted && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                    已删除的维度
                  </span>
                )}
                <span className="text-blue-700 font-bold">
                  得分：{dimScore?.score ?? '-'}
                </span>
              </div>
              <p className="text-gray-600 mb-6">{dimension.description}</p>

              <div className="space-y-6">
                {dimension.questions.map((question: any) => {
                  const answer = answers.find(
                    (a) => a.questionId === question.id
                  )
                  if (!answer) return null
                  const option = question.options.find(
                    (o: any) => o.id === answer.answer
                  )
                  return (
                    <div key={question.id} className="border-t pt-4">
                      <div className="flex items-start">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-gray-800">{question.text}</p>
                            {question.deleted && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                                已删除的问题
                              </span>
                            )}
                          </div>
                          <div className="mt-2">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {option
                                ? `${option.description}（分数：${option.score}）`
                                : '无选项'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
