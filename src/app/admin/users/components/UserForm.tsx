'use client'

import { useState } from 'react'
import { createAdmin, updateAdmin } from '../actions'
import type { Admin } from '../types'

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
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {admin ? '编辑管理员' : '添加管理员'}
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <input
              type="text"
              name="username"
              defaultValue={admin?.username}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {admin ? '新密码（留空则不修改）' : '密码'}
            </label>
            <input
              type="password"
              name="password"
              required={!admin}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名（可选）
            </label>
            <input
              type="text"
              name="name"
              defaultValue={admin?.name || ''}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
