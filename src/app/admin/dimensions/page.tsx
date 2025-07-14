'use client'

import { useState, useEffect } from 'react'
import { getDimensions, deleteDimension } from './actions'
import DimensionForm from './components/DimensionForm'
import { Dimension } from './types'

export default function DimensionsPage() {
  const [dimensions, setDimensions] = useState<Dimension[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingDimension, setEditingDimension] = useState<Dimension | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 初始加载数据
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

  const handleEdit = (dimension: Dimension) => {
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
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">维度名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">题目数量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dimensions.map((dimension) => (
              <tr key={dimension.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dimension.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dimension.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{dimension.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dimension.questions.length}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
    </div>
  )
} 