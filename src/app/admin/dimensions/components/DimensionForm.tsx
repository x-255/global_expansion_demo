import { useState, useEffect, useRef } from 'react'
import { createDimension, updateDimension } from '../actions'
import { DimensionFormData } from '../types'
import { getMaturityLevels } from '../../maturity-levels/actions'

interface DimensionFormProps {
  dimension?: {
    id: number
    name: string
    description: string | null
    weight: number
    order?: number
    coreCapability?: string
    DimensionStrategy?: Array<{
      id: number
      levelId: number
      definition: string
      level?: {
        name: string
        minScore: number
        maxScore: number
      }
      actions?: Array<{
        content: string
      }>
    }>
    strategies?: Array<{
      id: number
      content: string
      levelId: number
    }>
  }
  onClose: () => void
}

export default function DimensionForm({
  dimension,
  onClose,
}: DimensionFormProps) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [maturityLevels, setMaturityLevels] = useState<Array<{
    id: number
    name: string
    level: number
    minScore: number
    maxScore: number
  }>>([])
  // 典型特征
  const [maturityLevelDescriptions, setMaturityLevelDescriptions] = useState<{
    [levelId: number]: { definition: string }
  }>({})
  // 策略与方案
  const [strategies, setStrategies] = useState<{
    [levelId: number]: { content: string }[]
  }>({})
  // 新增：用于聚焦每个等级下每个策略输入框
  const strategyRefs = useRef<{
    [levelId: number]: Array<HTMLInputElement | null>
  }>({})
  const [focusStrategy, setFocusStrategy] = useState<number | null>(null)

  useEffect(() => {
    getMaturityLevels().then((levels) => {
      setMaturityLevels(levels)
      // 初始化描述
      if (dimension && dimension.DimensionStrategy) {
        const descMap: Record<number, { definition: string }> = {}
        const stratMap: Record<number, Array<{ content: string }>> = {}
        dimension.DimensionStrategy.forEach((ds) => {
          descMap[ds.levelId] = { definition: ds.definition }
          stratMap[ds.levelId] = (ds.actions || []).map((action) => ({
            content: action.content,
          }))
        })
        setMaturityLevelDescriptions(descMap)
        setStrategies(stratMap)
      } else {
        const descMap: Record<number, { definition: string }> = {}
        const stratMap: Record<number, Array<{ content: string }>> = {}
        levels.forEach((level) => {
          descMap[level.id] = { definition: '' }
          stratMap[level.id] = []
        })
        setMaturityLevelDescriptions(descMap)
        setStrategies(stratMap)
      }
    })
  }, [dimension])

  useEffect(() => {
    if (focusStrategy && strategyRefs.current[focusStrategy]) {
      const arr = strategyRefs.current[focusStrategy]
      if (arr && arr.length > 0) {
        const last = arr[arr.length - 1]
        if (last) last.focus()
      }
      setFocusStrategy(null)
    }
  }, [strategies, focusStrategy])

  const handleDescChange = (levelId: number, value: string) => {
    setMaturityLevelDescriptions((prev) => ({
      ...prev,
      [levelId]: {
        definition: value,
      },
    }))
  }

  // 策略与方案操作
  const handleStrategyChange = (
    levelId: number,
    idx: number,
    value: string
  ) => {
    setStrategies((prev) => {
      const arr = prev[levelId] ? [...prev[levelId]] : []
      arr[idx] = { content: value }
      return { ...prev, [levelId]: arr }
    })
  }
  const handleAddStrategy = (levelId: number) => {
    setStrategies((prev) => {
      const arr = prev[levelId] ? [...prev[levelId]] : []
      arr.push({ content: '' })
      return { ...prev, [levelId]: arr }
    })
    setFocusStrategy(levelId)
  }
  const handleRemoveStrategy = (levelId: number, idx: number) => {
    setStrategies((prev) => {
      const arr = prev[levelId] ? [...prev[levelId]] : []
      arr.splice(idx, 1)
      return { ...prev, [levelId]: arr }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data: DimensionFormData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      coreCapability: formData.get('coreCapability') as string,
      weight: parseFloat(formData.get('weight') as string),
      order: parseInt(formData.get('order') as string),
      maturityLevelDescriptions: maturityLevels.map((level) => ({
        levelId: level.id,
        definition: maturityLevelDescriptions[level.id]?.definition || '',
        strategies: (strategies[level.id] || [])
          .map((s) => s.content)
          .filter(Boolean),
      })),
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {dimension ? '编辑维度' : '添加维度'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                维度名称 *
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
                权重 *
              </label>
              <input
                type="number"
                name="weight"
                min="0"
                step="0.01"
                defaultValue={dimension?.weight ?? 1}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                排序 *
              </label>
              <input
                type="number"
                name="order"
                min="0"
                defaultValue={dimension?.order ?? 0}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                核心能力 *
              </label>
              <input
                type="text"
                name="coreCapability"
                defaultValue={dimension?.coreCapability}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述 *
            </label>
            <textarea
              name="description"
              defaultValue={dimension?.description ?? ''}
              required
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              维度成熟度等级描述
            </label>
            <div className="space-y-4">
              {maturityLevels.map((level) => (
                <div key={level.id} className="border rounded p-3">
                  <div className="font-semibold mb-1">
                    {level.name}（分数范围：{level.minScore} - {level.maxScore}
                    ）
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs text-gray-600 mb-1">
                      该等级下的典型特征 *
                    </label>
                    <textarea
                      value={
                        maturityLevelDescriptions[level.id]?.definition || ''
                      }
                      onChange={(e) =>
                        handleDescChange(level.id, e.target.value)
                      }
                      required
                      rows={2}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs text-gray-600 mb-1">
                      策略与方案
                    </label>
                    {(strategies[level.id] || []).map((s, idx) => (
                      <div key={idx} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={s.content}
                          onChange={(e) =>
                            handleStrategyChange(level.id, idx, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border rounded-md"
                          placeholder="请输入策略或方案"
                          ref={(el) => {
                            if (!strategyRefs.current[level.id])
                              strategyRefs.current[level.id] = []
                            strategyRefs.current[level.id][idx] = el
                          }}
                        />
                        <button
                          type="button"
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveStrategy(level.id, idx)}
                          title="删除"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      onClick={() => handleAddStrategy(level.id)}
                    >
                      + 增加策略/方案
                    </button>
                  </div>
                </div>
              ))}
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
