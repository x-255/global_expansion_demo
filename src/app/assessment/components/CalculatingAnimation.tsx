'use client'

export default function CalculatingAnimation() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
        <div className="text-2xl font-semibold text-gray-700 mb-2">
          正在计算评估结果
        </div>
        <div className="text-gray-500">请稍候...</div>
      </div>
    </div>
  )
}
