'use client'

import { useState, useEffect, useCallback } from 'react'
import { getQuestions, deleteQuestion, type QuestionWithDimension } from './actions'
import { getDimensions } from '../dimensions/actions'
import QuestionForm from './components/QuestionForm'
import { Dimension } from '../dimensions/types'

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionWithDimension[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [dimensions, setDimensions] = useState<Dimension[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithDimension | null>(null)
  const [selectedDimensionId, setSelectedDimensionId] = useState<string>('')

  const loadQuestions = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getQuestions()
      setQuestions(data)
      setIsLoading(false)
    } catch (error) {
      console.error('加载问题列表失败:', error)
      setError('加载问题列表失败，请稍后重试')
      setQuestions([])
      setIsLoading(false)
    }
  }, [])

  const loadDimensions = useCallback(async () => {
    try {
      const data = await getDimensions()
      setDimensions(data || [])
    } catch (error) {
      console.error('加载维度列表失败:', error)
      setError('加载维度列表失败，请稍后重试')
      setDimensions([])
    }
  }, [])

  useEffect(() => {
    loadQuestions()
    loadDimensions()
  }, [loadQuestions, loadDimensions])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const handleEdit = (question: QuestionWithDimension) => {
    setEditingQuestion(question)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个题目吗？')) {
      return
    }

    setIsLoading(true)
    try {
      await deleteQuestion(id)
      await loadQuestions()
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingQuestion(null)
    loadQuestions()
  }

  // 过滤问题列表
  const filteredQuestions = selectedDimensionId
    ? questions.filter(q => q.dimension?.id === parseInt(selectedDimensionId, 10))
    : questions

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">题目管理</h1>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          添加题目
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          按维度筛选
        </label>
        <select
          value={selectedDimensionId}
          onChange={(e) => setSelectedDimensionId(e.target.value)}
          className="w-64 px-3 py-2 border rounded-md"
        >
          <option value="">全部维度</option>
          {dimensions.map((dimension) => (
            <option key={dimension.id} value={dimension.id}>
              {dimension.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                问题文本
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                解释说明
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                所属维度
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuestions.map((question) => (
              <tr key={question.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.text}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.explanation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.dimension?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(question)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <QuestionForm
          question={editingQuestion || undefined}
          dimensions={dimensions}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
} 