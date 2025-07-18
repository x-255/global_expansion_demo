import { useState } from 'react'
import { createMaturityLevel, updateMaturityLevel } from '../actions'
import { MaturityLevel, MaturityLevelFormData } from '../types'

interface MaturityLevelFormProps {
  maturityLevel?: MaturityLevel
  onClose: () => void
}

export default function MaturityLevelForm({
  maturityLevel,
  onClose,
}: MaturityLevelFormProps) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data: MaturityLevelFormData = {
      level: parseInt(formData.get('level') as string),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      coreFeatures: formData.get('coreFeatures') as string,
      minScore: parseFloat(formData.get('minScore') as string),
      maxScore: parseFloat(formData.get('maxScore') as string),
    }

    try {
      if (maturityLevel) {
        await updateMaturityLevel(maturityLevel.id, data)
      } else {
        await createMaturityLevel(data)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {maturityLevel ? '编辑成熟度等级' : '添加成熟度等级'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                等级数值 *
              </label>
              <input
                type="number"
                name="level"
                defaultValue={maturityLevel?.level}
                min="1"
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="如：1"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                等级名称 *
              </label>
              <input
                type="text"
                name="name"
                defaultValue={maturityLevel?.name}
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="如：L1（初始级）"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              等级描述 *
            </label>
            <textarea
              name="description"
              defaultValue={maturityLevel?.description ?? ''}
              required
              rows={2}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="如：未建立相关能力或完全依赖外部支持"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              核心特征 *
            </label>
            <textarea
              name="coreFeatures"
              defaultValue={maturityLevel?.coreFeatures ?? ''}
              required
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="如：缺乏战略规划、市场洞察、资源协同等核心能力，国际化实践零散且无体系"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最小分数 *
              </label>
              <input
                type="number"
                name="minScore"
                defaultValue={maturityLevel?.minScore}
                step="0.1"
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="如：0"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最大分数 *
              </label>
              <input
                type="number"
                name="maxScore"
                defaultValue={maturityLevel?.maxScore}
                step="0.1"
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="如：20"
              />
            </div>
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
