'use client'

import { useState } from 'react'
import { createMaturityLevel, updateMaturityLevel } from '../actions'
import { MaturityLevel, MaturityLevelFormData } from '../types'
import { Modal, Button, Input } from '@/components/admin'

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
    <Modal
      isOpen={true}
      onClose={onClose}
      title={maturityLevel ? '编辑成熟度等级' : '添加成熟度等级'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <Modal.Body className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="等级数值"
              name="level"
              type="number"
              defaultValue={maturityLevel?.level?.toString()}
              min="1"
              required
              placeholder="如：1"
            />

            <Input
              label="等级名称"
              name="name"
              defaultValue={maturityLevel?.name}
              required
              placeholder="如：L1（初始级）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              等级描述 *
            </label>
            <textarea
              name="description"
              defaultValue={maturityLevel?.description ?? ''}
              required
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
              placeholder="如：未建立相关能力或完全依赖外部支持"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              核心特征 *
            </label>
            <textarea
              name="coreFeatures"
              defaultValue={maturityLevel?.coreFeatures ?? ''}
              required
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
              placeholder="如：缺乏战略规划、市场洞察、资源协同等核心能力，国际化实践零散且无体系"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="最小分数"
              name="minScore"
              type="number"
              defaultValue={maturityLevel?.minScore?.toString()}
              step="0.1"
              required
              placeholder="如：0"
            />

            <Input
              label="最大分数"
              name="maxScore"
              type="number"
              defaultValue={maturityLevel?.maxScore?.toString()}
              step="0.1"
              required
              placeholder="如：20"
            />
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
