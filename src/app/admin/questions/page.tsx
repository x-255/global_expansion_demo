'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getQuestions,
  deleteQuestion,
  type QuestionWithOptions,
} from './actions'
import { getDimensions } from '../dimensions/actions'
import QuestionForm from './components/QuestionForm'
import { Dimension } from '../dimensions/types'

function QuestionDetail({
  question,
  onClose,
}: {
  question: QuestionWithOptions
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">题目详情</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              题目内容
            </label>
            <p className="text-gray-900 whitespace-pre-wrap">{question.text}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                权重
              </label>
              <p className="text-gray-900">{question.weight}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                排序
              </label>
              <p className="text-gray-900">{question.order}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                所属维度
              </label>
              <p className="text-gray-900">{question.dimension?.name}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              选项
            </label>
            <ul className="list-disc pl-5 mt-1">
              {question.options?.map((opt) => (
                <li key={opt.id} className="text-gray-900">
                  {opt.description}（分数：{opt.score}）
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [dimensions, setDimensions] = useState<Dimension[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [editingQuestion, setEditingQuestion] =
    useState<QuestionWithOptions | null>(null)
  const [viewingQuestion, setViewingQuestion] =
    useState<QuestionWithOptions | null>(null)
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

  const handleEdit = (question: QuestionWithOptions) => {
    setEditingQuestion(question)
    setShowForm(true)
  }

  const handleView = (question: QuestionWithOptions) => {
    setViewingQuestion(question)
    setShowDetail(true)
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

  const handleCloseDetail = () => {
    setShowDetail(false)
    setViewingQuestion(null)
  }

  // 过滤问题列表
  const filteredQuestions = selectedDimensionId
    ? questions.filter(
        (q) => q.dimension?.id === parseInt(selectedDimensionId, 10)
      )
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
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                题目内容
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                所属维度
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                权重
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                排序
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuestions.map((question) => (
              <tr key={question.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {question.text}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.dimension?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.weight}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleView(question)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    查看详情
                  </button>
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
      {showDetail && viewingQuestion && (
        <QuestionDetail
          question={viewingQuestion}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  )
}
