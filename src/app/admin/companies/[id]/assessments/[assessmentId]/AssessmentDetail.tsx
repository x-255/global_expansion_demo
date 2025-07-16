'use client'

import { useEffect, useState } from 'react'
import type { Dimension, Question, CompanyAssessment } from '@/generated/prisma/client'

interface Props {
  dimensions: (Dimension & { questions: Question[] })[]
  params: {
    id: string
    assessmentId: string
  }
}

interface Answer {
  questionId: number
  answer: number
}

export function AssessmentDetail({ dimensions, params }: Props) {
  const [assessment, setAssessment] = useState<CompanyAssessment | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        // 加载评估记录
        const assessmentData = await fetch(`/api/assessments/${params.assessmentId}`).then(res => res.json())
        setAssessment(assessmentData)
        
        // 处理answers数据
        let parsedAnswers: Answer[] = []
        if (assessmentData.answers) {
          try {
            // 如果answers已经是对象，直接使用
            if (Array.isArray(assessmentData.answers)) {
              parsedAnswers = assessmentData.answers
            } else if (typeof assessmentData.answers === 'string') {
              // 尝试解析字符串
              parsedAnswers = JSON.parse(assessmentData.answers)
            } else if (typeof assessmentData.answers === 'object') {
              // 如果是对象，转换为数组
              parsedAnswers = Object.values(assessmentData.answers)
            }
          } catch (e) {
            console.error('解析answers失败:', e, assessmentData.answers)
            parsedAnswers = []
          }
        }
        setAnswers(parsedAnswers)
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

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">未找到评估记录</div>
      </div>
    )
  }

  // 将选项数字转换为文本描述
  const getAnswerText = (answer: number) => {
    const options = ['非常反对', '反对', '不确定', '同意', '非常同意']
    return options[answer]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">评估记录详情</h1>
        <p className="text-gray-600">
          评估时间：{new Date(assessment.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="space-y-8">
        {dimensions.map((dimension) => (
          <div key={dimension.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{dimension.name}</h2>
              {dimension.deleted && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                  已删除的维度
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-6">{dimension.description}</p>

            <div className="space-y-6">
              {dimension.questions.map((question) => {
                const answer = answers.find(a => a.questionId === question.id)
                if (!answer) return null // 如果没有回答，不显示这个问题
                
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
                        {question.explanation && (
                          <p className="text-sm text-gray-500 mb-2">{question.explanation}</p>
                        )}
                        <div className="mt-2">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {getAnswerText(answer.answer)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 