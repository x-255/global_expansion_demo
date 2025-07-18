'use client'

import { useState, useEffect } from 'react'
import { getMaturityLevels, deleteMaturityLevel } from './actions'
import MaturityLevelForm from './components/MaturityLevelForm'
import MaturityLevelDetail from './components/MaturityLevelDetail'
import { MaturityLevel } from './types'

export default function MaturityLevelsPage() {
  const [maturityLevels, setMaturityLevels] = useState<MaturityLevel[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [editingMaturityLevel, setEditingMaturityLevel] =
    useState<MaturityLevel | null>(null)
  const [viewingMaturityLevel, setViewingMaturityLevel] =
    useState<MaturityLevel | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 初始加载数据
  useEffect(() => {
    loadMaturityLevels()
  }, [])

  const loadMaturityLevels = async () => {
    try {
      const data = await getMaturityLevels()
      setMaturityLevels(data)
    } catch {
      setError('加载成熟度等级列表失败，请稍后重试')
      setLoading(false)
    }
  }

  const handleView = (maturityLevel: MaturityLevel) => {
    setViewingMaturityLevel(maturityLevel)
    setShowDetail(true)
  }

  const handleEdit = (maturityLevel: MaturityLevel) => {
    setEditingMaturityLevel(maturityLevel)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个成熟度等级吗？')) {
      return
    }

    setLoading(true)
    try {
      await deleteMaturityLevel(id)
      await loadMaturityLevels()
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingMaturityLevel(null)
    loadMaturityLevels()
  }

  const handleCloseDetail = () => {
    setShowDetail(false)
    setViewingMaturityLevel(null)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">成熟度等级管理</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          添加成熟度等级
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
                等级名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                等级数值
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                分数范围
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {maturityLevels.map((maturityLevel) => (
              <tr key={maturityLevel.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {maturityLevel.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {maturityLevel.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {maturityLevel.level}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {maturityLevel.minScore} - {maturityLevel.maxScore}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    onClick={() => handleView(maturityLevel)}
                    disabled={loading}
                  >
                    查看详情
                  </button>
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    onClick={() => handleEdit(maturityLevel)}
                    disabled={loading}
                  >
                    编辑
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(maturityLevel.id)}
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
        <MaturityLevelForm
          maturityLevel={editingMaturityLevel || undefined}
          onClose={handleCloseForm}
        />
      )}

      {showDetail && viewingMaturityLevel && (
        <MaturityLevelDetail
          maturityLevel={viewingMaturityLevel}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  )
}
