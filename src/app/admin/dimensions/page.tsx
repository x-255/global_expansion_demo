'use client'

import { useState, useEffect } from 'react'
import { getDimensions, deleteDimension } from './actions'
import DimensionForm from './components/DimensionForm'
import { DimensionWithQuestions } from './types'
import { Card, Button, Table, Modal } from '@/components/admin'

function DimensionDetail({
  dimension,
  onClose,
}: {
  dimension: DimensionWithQuestions
  onClose: () => void
}) {
  return (
    <Modal isOpen={true} onClose={onClose} title="维度详情" size="lg">
      <Modal.Body className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ID
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
              {dimension.id}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              排序
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
              {dimension.order}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              权重
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
              {dimension.weight}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              核心能力
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
              {dimension.coreCapability}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            维度名称
          </label>
          <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
            {dimension.name}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            描述
          </label>
          <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg whitespace-pre-wrap">
            {dimension.description}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            题目数量
          </label>
          <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
            {dimension.questions?.length ?? 0}
          </p>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3">
            各等级描述
          </label>
          <div className="space-y-4">
            {(dimension.DimensionStrategy || []).map((ds) => (
              <Card key={ds.levelId} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900">
                    {ds.level?.name || ds.levelId}
                  </h4>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    分数：{ds.level?.minScore} - {ds.level?.maxScore}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="font-medium text-slate-700">典型特征：</span>
                  <span className="text-slate-600 ml-2">{ds.definition}</span>
                </div>
                {ds.actions && ds.actions.length > 0 && (
                  <div>
                    <span className="font-medium text-slate-700">
                      策略与方案：
                    </span>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {ds.actions.map((action, idx) => (
                        <li key={idx} className="text-slate-600">
                          {action.content}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          关闭
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default function DimensionsPage() {
  const [dimensions, setDimensions] = useState<DimensionWithQuestions[]>([])
  const [showForm, setShowForm] = useState(false)

  const [editingDimension, setEditingDimension] =
    useState<DimensionWithQuestions | null>(null)
  const [viewingDimension, setViewingDimension] =
    useState<DimensionWithQuestions | null>(null)
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

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
    },
    {
      key: 'name',
      title: '维度名称',
      width: 200,
    },
    {
      key: 'order',
      title: '排序',
      width: 100,
    },
    {
      key: 'weight',
      title: '权重',
      width: 100,
    },
    {
      key: 'coreCapability',
      title: '核心能力',
      width: 150,
    },
    {
      key: 'actions',
      title: '操作',
      width: 200,
      render: (_: unknown, record: DimensionWithQuestions) => (
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
          actions={<Button onClick={() => setShowForm(true)}>添加维度</Button>}
        >
          <h1 className="text-2xl font-semibold text-slate-900">维度管理</h1>
        </Card.Header>

        <Card.Body className="p-0">
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <Table
            columns={columns}
            data={dimensions}
            loading={loading}
            emptyText="暂无维度数据"
          />
        </Card.Body>
      </Card>

      {showForm && (
        <DimensionForm
          dimension={editingDimension || undefined}
          onClose={handleCloseForm}
        />
      )}

      {viewingDimension && (
        <DimensionDetail
          dimension={viewingDimension}
          onClose={() => setViewingDimension(null)}
        />
      )}
    </div>
  )
}
