'use client'

import { useState, useEffect } from 'react'
import { getDimensions, deleteDimension } from './actions'
import DimensionForm from './components/DimensionForm'
import { DimensionWithQuestions } from './types'

function DimensionDetail({
  dimension,
  onClose,
}: {
  dimension: DimensionWithQuestions
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">维度详情</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID
              </label>
              <p className="text-gray-900">{dimension.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                排序
              </label>
              <p className="text-gray-900">{dimension.order}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                权重
              </label>
              <p className="text-gray-900">{dimension.weight}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                核心能力
              </label>
              <p className="text-gray-900">{dimension.coreCapability}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              维度名称
            </label>
            <p className="text-gray-900">{dimension.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <p className="text-gray-900 whitespace-pre-wrap">
              {dimension.description}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              题目数量
            </label>
            <p className="text-gray-900">{dimension.questions?.length ?? 0}</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              各等级描述
            </label>
            <div className="space-y-2">
              {(dimension.DimensionStrategy || []).map((ds) => (
                <div key={ds.levelId} className="border rounded p-2">
                  <div className="font-semibold">
                    {ds.level?.name || ds.levelId}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    分数范围：{ds.level?.minScore} - {ds.level?.maxScore}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">典型特征：</span>
                    <span>{ds.definition}</span>
                  </div>
                  {ds.actions && ds.actions.length > 0 && (
                    <div className="mt-2">
                      <span className="font-medium">策略与方案：</span>
                      <ul className="list-disc pl-5 mt-1">
                        {ds.actions.map((action, idx) => (
                          <li key={idx} className="text-gray-900">
                            {action.content}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
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

export default function DimensionsPage() {
  const [dimensions, setDimensions] = useState<DimensionWithQuestions[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [editingDimension, setEditingDimension] = useState<DimensionWithQuestions | null>(null)
  const [viewingDimension, setViewingDimension] = useState<DimensionWithQuestions | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDimensions()
  }, [])

  const loadDimensions = async () => {
    try {
      const data = await getDimensions()
      setDimensions(data)
    } catch {
      setError('加载维度列表失败，请稍后重试')
      setLoading(false)
    }
  }

  const handleView = (dimension: DimensionWithQuestions) => {
    setViewingDimension(dimension)
  }

  const handleEdit = (dimension: DimensionWithQuestions) => {
    setEditingDimension(dimension)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个维度吗？')) {
      return
    }
    setLoading(true)
    try {
      await deleteDimension(id)
      await loadDimensions()
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingDimension(null)
    loadDimensions()
  }

  const handleCloseDetail = () => {
    setShowDetail(false)
    setViewingDimension(null)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">维度管理</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          添加维度
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                维度名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                排序
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                权重
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                核心能力
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dimensions.map((dimension) => (
              <tr key={dimension.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dimension.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {dimension.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dimension.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dimension.weight}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dimension.coreCapability}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    onClick={() => handleView(dimension)}
                    disabled={loading}
                  >
                    查看详情
                  </button>
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    onClick={() => handleEdit(dimension)}
                    disabled={loading}
                  >
                    编辑
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(dimension.id)}
                    disabled={loading}
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
        <DimensionForm
          dimension={editingDimension || undefined}
          onClose={handleCloseForm}
        />
      )}

      {showDetail && viewingDimension && (
        <DimensionDetail
          dimension={viewingDimension}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  )
}
