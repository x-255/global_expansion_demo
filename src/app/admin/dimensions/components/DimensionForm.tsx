import { useState } from 'react'
import { createDimension, updateDimension } from '../actions'
import { Dimension, DimensionFormData } from '../types'

interface DimensionFormProps {
  dimension?: Dimension
  onClose: () => void
}

export default function DimensionForm({
  dimension,
  onClose,
}: DimensionFormProps) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data: DimensionFormData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    }

    try {
      if (dimension) {
        await updateDimension(dimension.id, data)
      } else {
        await createDimension(data)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {dimension ? '编辑维度' : '添加维度'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              维度名称
            </label>
            <input
              type="text"
              name="name"
              defaultValue={dimension?.name}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <textarea
              name="description"
              defaultValue={dimension?.description ?? ''}
              required
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

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
