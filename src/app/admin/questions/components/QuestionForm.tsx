import { useState, useRef, useEffect } from 'react'
import {
  createQuestion,
  updateQuestion,
  type QuestionWithOptions,
} from '../actions'
import type { QuestionFormData } from '../types'
import { Dimension } from '../../dimensions/types'

interface QuestionFormProps {
  question?: QuestionWithOptions
  dimensions: Dimension[]
  onClose: () => void
}

export default function QuestionForm({
  question,
  dimensions,
  onClose,
}: QuestionFormProps) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<
    { description: string; score: number }[]
  >(
    question?.options?.length
      ? question.options.map((opt) => ({
          description: opt.description,
          score: opt.score,
        }))
      : [{ description: '', score: 1 }]
  )
  const [weight, setWeight] = useState<number>(question?.weight ?? 1)
  const [order, setOrder] = useState<number>(question?.order ?? 0)
  // 新增：用于聚焦每个描述输入框
  const optionRefs = useRef<Array<HTMLInputElement | null>>([])
  const [focusLast, setFocusLast] = useState(false)

  useEffect(() => {
    if (focusLast && optionRefs.current.length > 0) {
      const last = optionRefs.current[optionRefs.current.length - 1]
      if (last) last.focus()
      setFocusLast(false)
    }
  }, [options, focusLast])

  const handleOptionChange = (
    idx: number,
    field: 'description' | 'score',
    value: string
  ) => {
    setOptions((prev) => {
      const arr = [...prev]
      if (field === 'score') {
        arr[idx][field] = Number(value)
      } else {
        arr[idx][field] = value
      }
      return arr
    })
  }
  const handleAddOption = () => {
    setOptions((prev) => {
      const lastScore = prev.length > 0 ? prev[prev.length - 1].score : 0
      return [...prev, { description: '', score: lastScore + 1 }]
    })
    setFocusLast(true)
  }
  const handleRemoveOption = (idx: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data: QuestionFormData = {
      text: formData.get('text') as string,
      dimensionId: parseInt(formData.get('dimensionId') as string, 10),
      weight,
      order,
      options: options.filter((opt) => opt.description.trim() !== ''),
    }

    try {
      if (question) {
        await updateQuestion(question.id, data)
      } else {
        await createQuestion(data)
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
          {question ? '编辑题目' : '添加题目'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              所属维度
            </label>
            <select
              name="dimensionId"
              defaultValue={question?.dimensionId}
              required
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">请选择维度</option>
              {dimensions.map((dimension) => (
                <option key={dimension.id} value={dimension.id}>
                  {dimension.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              题目内容
            </label>
            <textarea
              name="text"
              defaultValue={question?.text}
              required
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                权重 *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                排序 *
              </label>
              <input
                type="number"
                min="0"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              问题选项
            </label>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt.description}
                    onChange={(e) =>
                      handleOptionChange(idx, 'description', e.target.value)
                    }
                    placeholder="选项描述"
                    className="flex-1 px-3 py-2 border rounded-md"
                    required
                    ref={(el) => {
                      optionRefs.current[idx] = el
                    }}
                  />
                  <input
                    type="number"
                    value={opt.score}
                    onChange={(e) =>
                      handleOptionChange(idx, 'score', e.target.value)
                    }
                    placeholder="分数"
                    className="w-24 px-3 py-2 border rounded-md"
                    required
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveOption(idx)}
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
                onClick={handleAddOption}
              >
                + 增加选项
              </button>
            </div>
          </div>

          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-4">
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
