'use client'

import { useState, useRef, useEffect } from 'react'
import {
  createQuestion,
  updateQuestion,
  type QuestionWithOptions,
} from '../actions'
import type { QuestionFormData } from '../types'
import { Dimension } from '../../dimensions/types'
import { Modal, Button } from '@/components/admin'

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
    <Modal
      isOpen={true}
      onClose={onClose}
      title={question ? '编辑题目' : '添加题目'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <Modal.Body className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              所属维度
            </label>
            <select
              name="dimensionId"
              defaultValue={question?.dimensionId}
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">请选择维度</option>
              {dimensions.map((dimension) => (
                <option key={dimension.id} value={dimension.id}>
                  {dimension.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              题目内容
            </label>
            <textarea
              name="text"
              defaultValue={question?.text}
              required
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                权重 *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                排序 *
              </label>
              <input
                type="number"
                min="0"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
