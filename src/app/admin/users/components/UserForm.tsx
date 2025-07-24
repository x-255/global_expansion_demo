'use client'

import { useState } from 'react'
import { createAdmin, updateAdmin } from '../actions'
import type { Admin } from '../types'
import { Modal, Button, Input } from '@/components/admin'

interface Props {
  admin?: Admin
  onClose: () => void
}

export default function UserForm({ admin, onClose }: Props) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
    }

    try {
      if (admin) {
        await updateAdmin(admin.id, data)
      } else {
        await createAdmin(data)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={admin ? '编辑管理员' : '添加管理员'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <Modal.Body className="space-y-6">
          <Input
            label="用户名"
            name="username"
            defaultValue={admin?.username}
            required
            placeholder="请输入用户名"
          />

          <Input
            label={admin ? '新密码（留空则不修改）' : '密码'}
            name="password"
            type="password"
            required={!admin}
            placeholder="请输入密码"
          />

          <Input
            label="姓名（可选）"
            name="name"
            defaultValue={admin?.name || ''}
            placeholder="请输入姓名"
          />

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            取消
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            保存
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
