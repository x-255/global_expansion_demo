'use client'

import { useState, useEffect, useCallback } from 'react'
import type { MaturityLevel } from '@/generated/prisma/client'
import type { CoreStrategyWithDetails, CoreStrategyFormData } from '../types'
import {
  getMaturityLevels,
  createCoreStrategy,
  updateCoreStrategy,
} from '../actions'

interface Props {
  strategy?: CoreStrategyWithDetails | null
  onClose: () => void
  onSubmit: () => void
}

export function CoreStrategyForm({ strategy, onClose, onSubmit }: Props) {
  const [levels, setLevels] = useState<MaturityLevel[]>([])
  const [formData, setFormData] = useState<CoreStrategyFormData>({
    name: '',
    levelId: 0,
    order: 0,
    actions: [{ content: '', order: 0 }],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadLevels = useCallback(async () => {
    try {
      const data = await getMaturityLevels()
      setLevels(data)
      if (!strategy && data.length > 0) {
        setFormData((prev) => ({ ...prev, levelId: data[0].id }))
      }
    } catch (error) {
      console.error('加载成熟度等级失败:', error)
      setError('加载成熟度等级失败，请稍后重试')
    }
  }, [strategy])

  useEffect(() => {
    loadLevels()
    if (strategy) {
      setFormData({
        name: strategy.name,
        levelId: strategy.levelId,
        order: strategy.order,
        actions: strategy.actions.map((action) => ({
          id: action.id,
          content: action.content,
          order: action.order,
        })),
      })
    }
  }, [strategy, loadLevels])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (strategy) {
        await updateCoreStrategy(strategy.id, formData)
      } else {
        await createCoreStrategy(formData)
      }
      onSubmit()
    } catch (error) {
      console.error('保存核心策略失败:', error)
      setError('保存失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const addAction = () => {
    setFormData((prev) => ({
      ...prev,
      actions: [...prev.actions, { content: '', order: prev.actions.length }],
    }))
  }

  const removeAction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index),
    }))
  }

  const updateAction = (index: number, content: string) => {
    setFormData((prev) => ({
      ...prev,
      actions: prev.actions.map((action, i) =>
        i === index ? { ...action, content } : action
      ),
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {strategy ? '编辑核心策略' : '添加核心策略'}
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              策略名称
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              成熟度等级
            </label>
            <select
              value={formData.levelId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  levelId: Number(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              顺序
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  order: Number(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border rounded-md"
              required
              min="0"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              行动点
            </label>
            {formData.actions.map((action, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={action.content}
                  onChange={(e) => updateAction(index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md"
                  placeholder={`行动点 ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeAction(index)}
                  className="px-3 py-2 text-red-500 hover:text-red-700"
                >
                  删除
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAction}
              className="mt-2 text-primary hover:text-primary-dark"
            >
              + 添加行动点
            </button>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:bg-gray-400"
            >
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
