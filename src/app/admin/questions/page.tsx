'use client'

import { useState, useEffect, useCallback } from 'react'
import { getQuestions, type GetQuestionsResult } from './actions'
import { getDimensions } from '../dimensions/actions'
import QuestionForm from './components/QuestionForm'
import type { QuestionWithOptions } from './actions'
import type { Dimension } from '@/generated/prisma/client'
import { Pagination } from '@/app/components/Pagination'

const PAGE_SIZE = 10

export default function QuestionsPage() {
  const [questionsData, setQuestionsData] = useState<GetQuestionsResult>({
    questions: [],
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
  })
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

  // 加载数据的函数
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [questionsResult, dimensionsData] = await Promise.all([
        getQuestions({
          page: currentPage,
          pageSize: PAGE_SIZE,
          search: searchTerm,
          dimensionId: selectedDimension,
        }),
        getDimensions(),
      ])
      setQuestionsData(questionsResult)
      setDimensions(dimensionsData)
      setLoading(false)
    } catch (error) {
      console.error('加载数据失败:', error)
      setError('加载数据失败，请稍后重试')
      setLoading(false)
    }
  }, [currentPage, searchTerm, selectedDimension])

  useEffect(() => {
    loadData()
  }, [loadData])

  // 从服务端获取的数据
  const { questions, total } = questionsData

  const handleEdit = (question: QuestionWithOptions) => {
    setEditingQuestion(question)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingQuestion(null)
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
        找到 {total} 个问题
        {total > 0 && (
          <span className="ml-2 text-gray-500">
            | 显示第 {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, total)} 条
          </span>
        )}
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
                排序
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
            {questions.map((question) => (
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
                  {question.order}
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
      <Pagination
        currentPage={currentPage}
        total={total}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        className="mt-8"
      />

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
