import { useState } from 'react'
import { createQuestion, updateQuestion, type QuestionWithDimension } from '../actions'
import type { QuestionFormData } from '../types'
import { Dimension } from '../../dimensions/types'

interface QuestionFormProps {
  question?: QuestionWithDimension
  dimensions: Dimension[]
  onClose: () => void
}

export default function QuestionForm({ question, dimensions, onClose }: QuestionFormProps) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data: QuestionFormData = {
      text: formData.get('text') as string,
      dimensionId: parseInt(formData.get('dimensionId') as string, 10),
      explanation: (formData.get('explanation') ?? '') === '' ? null : (formData.get('explanation') as string)
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              解释说明（可选）
            </label>
            <textarea
              name="explanation"
              defaultValue={question?.explanation ?? undefined}
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}

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