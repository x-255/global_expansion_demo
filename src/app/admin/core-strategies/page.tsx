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

const PAGE_SIZE = 10

export default function CoreStrategiesPage() {
  const [strategiesData, setStrategiesData] = useState<GetCoreStrategiesResult>({
    strategies: [],
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
  })
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">核心策略管理</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          添加策略
        </button>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="搜索策略名称、等级名称或行动点内容..."
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
            value={selectedLevel}
            onChange={(e) => {
              setSelectedLevel(
                e.target.value === 'all' ? 'all' : Number(e.target.value)
              )
              setCurrentPage(1) // 重置页码
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat pr-12"
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

      {/* 结果统计 */}
      <div className="mb-4 text-gray-600">
        找到 {total} 个策略
        {total > 0 && (
          <span className="ml-2 text-gray-500">
            | 显示第 {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, total)} 条
          </span>
        )}
      </div>

      {/* 策略列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                策略名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                成熟度等级
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                顺序
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                行动点数量
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {strategies.map((strategy) => (
              <tr key={strategy.id}>
                <td className="px-6 py-4 whitespace-nowrap">{strategy.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {strategy.level.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {strategy.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {strategy.actions.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleView(strategy)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    查看
                  </button>
                  <button
                    onClick={() => handleEdit(strategy)}
                    className="text-primary hover:text-primary-dark"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(strategy)}
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
