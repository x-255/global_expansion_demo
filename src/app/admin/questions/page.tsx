'use client'

import { useState, useEffect, useCallback } from 'react'
import { getQuestions, type GetQuestionsResult } from './actions'
import { getDimensions } from '../dimensions/actions'
import QuestionForm from './components/QuestionForm'
import QuestionDetail from './components/QuestionDetail'
import type { QuestionWithOptions } from './actions'
import type { Dimension } from '@/generated/prisma/client'
import { Pagination } from '@/app/components/Pagination'
import { Card, Button, Table, Input } from '@/components/admin'

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
  const [showDetail, setShowDetail] = useState(false)
  const [viewingQuestion, setViewingQuestion] =
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

  const handleView = (question: QuestionWithOptions) => {
    setViewingQuestion(question)
    setShowDetail(true)
  }

  const handleDetailClose = () => {
    setShowDetail(false)
    setViewingQuestion(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
    },
    {
      key: 'text',
      title: '问题内容',
      width: 300,
    },
    {
      key: 'dimension',
      title: '所属维度',
      width: 150,
      render: (_: unknown, record: QuestionWithOptions) =>
        record.dimension?.name || '-',
    },
    {
      key: 'order',
      title: '排序',
      width: 100,
    },
    {
      key: 'options',
      title: '选项数量',
      width: 120,
      render: (_: unknown, record: QuestionWithOptions) =>
        record.options?.length || 0,
    },
    {
      key: 'actions',
      title: '操作',
      width: 150,
      render: (_: unknown, record: QuestionWithOptions) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleView(record)}
          >
            查看详情
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        </div>
      ),
    },
  ]

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header
          actions={<Button onClick={() => setShowForm(true)}>添加问题</Button>}
        >
          <h1 className="text-2xl font-semibold text-slate-900">问题管理</h1>
        </Card.Header>

        <Card.Body>
          {/* 搜索和筛选区域 */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索问题内容..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                leftIcon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
            </div>
            <div className="w-48">
              <select
                value={selectedDimension}
                onChange={(e) => {
                  setSelectedDimension(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="p-0">
          <Table
            columns={columns}
            data={questions}
            loading={loading}
            emptyText="暂无问题数据"
          />
        </Card.Body>
      </Card>

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

      {/* 问题详情弹窗 */}
      {showDetail && viewingQuestion && (
        <QuestionDetail
          question={viewingQuestion}
          onClose={handleDetailClose}
        />
      )}
    </div>
  )
}
