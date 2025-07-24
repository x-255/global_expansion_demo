'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getCoreStrategies,
  deleteCoreStrategy,
  getMaturityLevels,
  type GetCoreStrategiesResult,
} from './actions'
import { CoreStrategyForm } from './components/CoreStrategyForm'
import { CoreStrategyDetail } from './components/CoreStrategyDetail'
import type { CoreStrategyWithDetails } from './types'
import type { MaturityLevel } from '@/generated/prisma/client'
import { Pagination } from '@/app/components/Pagination'
import { Card, Button, Table, Input } from '@/components/admin'

const PAGE_SIZE = 10

export default function CoreStrategiesPage() {
  const [strategiesData, setStrategiesData] = useState<GetCoreStrategiesResult>(
    {
      strategies: [],
      total: 0,
      page: 1,
      pageSize: PAGE_SIZE,
    }
  )
  const [levels, setLevels] = useState<MaturityLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [editingStrategy, setEditingStrategy] =
    useState<CoreStrategyWithDetails | null>(null)
  const [selectedStrategy, setSelectedStrategy] =
    useState<CoreStrategyWithDetails | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // 加载数据的函数
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [strategiesResult, levelsData] = await Promise.all([
        getCoreStrategies({
          page: currentPage,
          pageSize: PAGE_SIZE,
          search: searchTerm,
          levelId: selectedLevel,
        }),
        getMaturityLevels(),
      ])
      setStrategiesData(strategiesResult)
      setLevels(levelsData)
      setLoading(false)
    } catch (error) {
      console.error('加载数据失败:', error)
      setError('加载数据失败，请稍后重试')
      setLoading(false)
    }
  }, [currentPage, searchTerm, selectedLevel])

  useEffect(() => {
    loadData()
  }, [loadData])

  // 从服务端获取的数据
  const { strategies, total } = strategiesData

  const handleEdit = (strategy: CoreStrategyWithDetails) => {
    setEditingStrategy(strategy)
    setShowForm(true)
  }

  const handleView = (strategy: CoreStrategyWithDetails) => {
    setSelectedStrategy(strategy)
    setShowDetail(true)
  }

  const handleDelete = async (strategy: CoreStrategyWithDetails) => {
    if (!confirm(`确定要删除策略"${strategy.name}"吗？`)) {
      return
    }

    try {
      await deleteCoreStrategy(strategy.id)
      await loadData()
    } catch (error) {
      console.error('删除策略失败:', error)
      alert('删除失败，请稍后重试')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingStrategy(null)
  }

  const handleDetailClose = () => {
    setShowDetail(false)
    setSelectedStrategy(null)
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

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
    },
    {
      key: 'name',
      title: '策略名称',
      width: 200,
    },
    {
      key: 'level',
      title: '成熟度等级',
      width: 150,
      render: (_: unknown, record: CoreStrategyWithDetails) =>
        record.level?.name || '-',
    },
    {
      key: 'actions',
      title: '行动点数量',
      width: 120,
      render: (_: unknown, record: CoreStrategyWithDetails) =>
        record.actions?.length || 0,
    },
    {
      key: 'operations',
      title: '操作',
      width: 200,
      render: (_: unknown, record: CoreStrategyWithDetails) => (
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
          <Button
            size="sm"
            variant="error"
            onClick={() => handleDelete(record)}
            loading={loading}
          >
            删除
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header
          actions={<Button onClick={() => setShowForm(true)}>添加策略</Button>}
        >
          <h1 className="text-2xl font-semibold text-slate-900">
            核心策略管理
          </h1>
        </Card.Header>

        <Card.Body>
          {/* 搜索和筛选区域 */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索策略名称、等级名称或行动点内容..."
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
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="all">所有等级</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
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
            data={strategies}
            loading={loading}
            emptyText="暂无策略数据"
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

      {/* 策略表单弹窗 */}
      {showForm && (
        <CoreStrategyForm
          strategy={editingStrategy}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* 策略详情弹窗 */}
      {showDetail && selectedStrategy && (
        <CoreStrategyDetail
          strategy={selectedStrategy}
          onClose={handleDetailClose}
        />
      )}
    </div>
  )
}
