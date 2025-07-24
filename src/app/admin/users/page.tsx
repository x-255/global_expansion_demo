'use client'

import { useState, useEffect } from 'react'
import { getAdmins, deleteAdmin } from './actions'
import UserForm from './components/UserForm'
import type { Admin } from './types'
import { Card, Button, Table } from '@/components/admin'

export default function UsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 初始加载数据
  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    try {
      const data = await getAdmins()
      setAdmins(data)
    } catch {
      setError('加载管理员列表失败，请稍后重试')
      setLoading(false)
    }
  }

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个管理员吗？')) {
      return
    }

    setLoading(true)
    try {
      await deleteAdmin(id)
      await loadAdmins()
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingAdmin(null)
    loadAdmins()
  }

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
    },
    {
      key: 'username',
      title: '用户名',
      width: 150,
    },
    {
      key: 'name',
      title: '姓名',
      width: 150,
    },
    {
      key: 'createdAt',
      title: '创建时间',
      width: 180,
      render: (_: unknown, record: Admin) =>
        new Date(record.createdAt).toLocaleString(),
    },
    {
      key: 'actions',
      title: '操作',
      width: 150,
      render: (_: unknown, record: Admin) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
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
            <Button onClick={() => setShowForm(true)}>添加管理员</Button>
          }
        >
          <h1 className="text-2xl font-semibold text-slate-900">管理员管理</h1>
        </Card.Header>

        <Card.Body className="p-0">
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <Table
            columns={columns}
            data={admins}
            loading={loading}
            emptyText="暂无管理员数据"
          />
        </Card.Body>
      </Card>

      {showForm && (
        <UserForm admin={editingAdmin || undefined} onClose={handleCloseForm} />
      )}
    </div>
  )
}
