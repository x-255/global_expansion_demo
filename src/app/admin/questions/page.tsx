'use client'

import { useState, useEffect } from 'react'
import { getQuestions } from './actions'
import { getDimensions } from '../dimensions/actions'
import QuestionForm from './components/QuestionForm'
import type { QuestionWithOptions } from './actions'
import type { Dimension } from '@/generated/prisma/client'

const PAGE_SIZE = 10

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([])
  const [dimensions, setDimensions] = useState<Dimension[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingQuestion, setEditingQuestion] =
    useState<QuestionWithOptions | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDimension, setSelectedDimension] = useState<number | 'all'>(
    'all'
  )
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [questionsData, dimensionsData] = await Promise.all([
        getQuestions(),
        getDimensions(),
      ])
      setQuestions(questionsData)
      setDimensions(dimensionsData)
      setLoading(false)
    } catch (error) {
      console.error('加载数据失败:', error)
      setError('加载数据失败，请稍后重试')
      setLoading(false)
    }
  }

  // 过滤和搜索问题
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesDimension =
      selectedDimension === 'all' || question.dimensionId === selectedDimension
    return matchesSearch && matchesDimension
  })

  // 计算分页数据
  const totalPages = Math.ceil(filteredQuestions.length / PAGE_SIZE)
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handleEdit = (question: QuestionWithOptions) => {
    setEditingQuestion(question)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingQuestion(null)
  }

  const handleFormSubmit = async () => {
    await loadData()
    handleFormClose()
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">问题管理</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          添加问题
        </button>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="搜索问题内容..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // 重置页码
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="w-48">
          <select
            value={selectedDimension}
            onChange={(e) => {
              setSelectedDimension(
                e.target.value === 'all' ? 'all' : Number(e.target.value)
              )
              setCurrentPage(1) // 重置页码
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat pr-12"
          >
            <option value="all">所有维度</option>
            {dimensions.map((dimension) => (
              <option key={dimension.id} value={dimension.id}>
                {dimension.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 结果统计 */}
      <div className="mb-4 text-gray-600">
        找到 {filteredQuestions.length} 个问题
      </div>

      {/* 问题列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                问题内容
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                所属维度
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                权重
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                选项数量
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedQuestions.map((question) => (
              <tr key={question.id}>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 line-clamp-2">
                    {question.text}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {question.dimension.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {question.weight}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {question.options.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(question)}
                    className="text-primary hover:text-primary-dark"
                  >
                    编辑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded-md cursor-pointer ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* 问题表单弹窗 */}
      {showForm && (
        <QuestionForm
          question={editingQuestion || undefined}
          dimensions={dimensions}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}
