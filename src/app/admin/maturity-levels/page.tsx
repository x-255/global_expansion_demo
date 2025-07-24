'use client'

import { useState, useEffect } from 'react'
import { getMaturityLevels, deleteMaturityLevel } from './actions'
import MaturityLevelForm from './components/MaturityLevelForm'
import MaturityLevelDetail from './components/MaturityLevelDetail'
import { MaturityLevel } from './types'
import { Card, Button, Table } from '@/components/admin'

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

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
    },
    {
      key: 'name',
      title: '等级名称',
      width: 150,
    },
    {
      key: 'level',
      title: '等级数值',
      width: 120,
    },
    {
      key: 'scoreRange',
      title: '分数范围',
      width: 150,
      render: (_: unknown, record: MaturityLevel) =>
        `${record.minScore} - ${record.maxScore}`,
    },
    {
      key: 'actions',
      title: '操作',
      width: 200,
      render: (_: unknown, record: MaturityLevel) => (
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
            onClick={() => handleDelete(record.id)}
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
          actions={
            <Button onClick={() => setShowForm(true)}>添加成熟度等级</Button>
          }
        >
          <h1 className="text-2xl font-semibold text-slate-900">
            成熟度等级管理
          </h1>
        </Card.Header>

        <Card.Body className="p-0">
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <Table
            columns={columns}
            data={maturityLevels}
            loading={loading}
            emptyText="暂无成熟度等级数据"
          />
        </Card.Body>
      </Card>

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
