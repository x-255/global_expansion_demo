'use client'

import type { CoreStrategyWithDetails } from '../types'
import { Modal, Button } from '@/components/admin'

interface Props {
  strategy: CoreStrategyWithDetails
  onClose: () => void
}

export function CoreStrategyDetail({ strategy, onClose }: Props) {
  return (
    <Modal isOpen={true} onClose={onClose} title="策略详情" size="lg">
      <Modal.Body className="space-y-6">
        {/* 基本信息 */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            基本信息
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                策略名称
              </label>
              <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
                {strategy.name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                成熟度等级
              </label>
              <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
                {strategy.level.name}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              等级描述
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg whitespace-pre-wrap">
              {strategy.level.description}
            </p>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              显示顺序
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
              {strategy.order}
            </p>
          </div>
        </div>

        {/* 行动点列表 */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">行动点</h3>
          <div className="space-y-3">
            {strategy.actions
              .sort((a, b) => a.order - b.order)
              .map((action, index) => (
                <div
                  key={action.id}
                  className="bg-slate-50 px-4 py-3 rounded-lg border border-slate-200"
                >
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 text-sm font-medium rounded-full mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-slate-900 flex-1">{action.content}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 创建和更新时间 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              创建时间
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
              {new Date(strategy.createdAt).toLocaleString('zh-CN')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              更新时间
            </label>
            <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">
              {new Date(strategy.updatedAt).toLocaleString('zh-CN')}
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
