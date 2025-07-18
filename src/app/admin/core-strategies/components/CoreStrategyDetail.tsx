'use client'

import type { CoreStrategyWithDetails } from '../types'

interface Props {
  strategy: CoreStrategyWithDetails
  onClose: () => void
}

export function CoreStrategyDetail({ strategy, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">策略详情</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

        <div className="space-y-6">
          {/* 基本信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-2">基本信息</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-gray-600">策略名称</div>
                <div className="col-span-3">{strategy.name}</div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-gray-600">成熟度等级</div>
                <div className="col-span-3">{strategy.level.name}</div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-gray-600">等级描述</div>
                <div className="col-span-3">{strategy.level.description}</div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-gray-600">显示顺序</div>
                <div className="col-span-3">{strategy.order}</div>
              </div>
            </div>
          </div>

          {/* 行动点列表 */}
          <div>
            <h3 className="text-lg font-semibold mb-2">行动点</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="list-decimal list-inside space-y-2">
                {strategy.actions
                  .sort((a, b) => a.order - b.order)
                  .map((action) => (
                    <li key={action.id} className="text-gray-700">
                      {action.content}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* 创建和更新时间 */}
          <div className="text-sm text-gray-500">
            <div>创建时间：{new Date(strategy.createdAt).toLocaleString()}</div>
            <div>更新时间：{new Date(strategy.updatedAt).toLocaleString()}</div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
