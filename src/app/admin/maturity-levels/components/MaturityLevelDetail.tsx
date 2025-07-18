import { MaturityLevel } from '../types'

interface MaturityLevelDetailProps {
  maturityLevel: MaturityLevel
  onClose: () => void
}

export default function MaturityLevelDetail({
  maturityLevel,
  onClose,
}: MaturityLevelDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">成熟度等级详情</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
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

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                等级数值
              </label>
              <p className="text-gray-900">{maturityLevel.level}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                等级名称
              </label>
              <p className="text-gray-900">{maturityLevel.name}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              等级描述
            </label>
            <p className="text-gray-900 whitespace-pre-wrap">
              {maturityLevel.description}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              核心特征
            </label>
            <p className="text-gray-900 whitespace-pre-wrap">
              {maturityLevel.coreFeatures}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最小分数
              </label>
              <p className="text-gray-900">{maturityLevel.minScore}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最大分数
              </label>
              <p className="text-gray-900">{maturityLevel.maxScore}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                创建时间
              </label>
              <p className="text-gray-900">
                {new Date(maturityLevel.createdAt).toLocaleString('zh-CN')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                更新时间
              </label>
              <p className="text-gray-900">
                {new Date(maturityLevel.updatedAt).toLocaleString('zh-CN')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
