'use client'

import { Modal, Button } from '@/components/admin'
import type { QuestionWithOptions } from '../actions'

interface QuestionDetailProps {
  question: QuestionWithOptions
  onClose: () => void
}

export default function QuestionDetail({
  question,
  onClose,
}: QuestionDetailProps) {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="问题详情"
      size="lg"
    >
      <Modal.Body className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              所属维度
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
              {question.dimension?.name || '未知维度'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              权重
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
              {question.weight}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            题目内容
          </label>
          <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg whitespace-pre-wrap">
            {question.text}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              排序
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
              {question.order}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              选项数量
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
              {question.options?.length || 0} 个选项
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            选项详情
          </label>
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div
                key={option.id}
                className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-slate-900 font-medium">
                      选项 {index + 1}
                    </p>
                    <p className="text-slate-700 mt-1">
                      {option.description}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm text-slate-600">分数</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {option.score}
                    </p>
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-slate-500 text-center py-4">暂无选项</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              创建时间
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
              {new Date(question.createdAt).toLocaleString('zh-CN')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              更新时间
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
              {new Date(question.updatedAt).toLocaleString('zh-CN')}
            </p>
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          关闭
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
