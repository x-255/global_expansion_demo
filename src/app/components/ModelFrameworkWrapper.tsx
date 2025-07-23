'use client'

import { useEffect, useState } from 'react'
import { getModelFrameworkData } from '../actions/model-framework'
import { ModelFramework } from './ModelFramework'
import type { ModelFrameworkData } from '../actions/model-framework'

interface ModelFrameworkWrapperProps {
  title?: string
  className?: string
}

export function ModelFrameworkWrapper({
  title,
  className,
}: ModelFrameworkWrapperProps) {
  const [data, setData] = useState<ModelFrameworkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const frameworkData = await getModelFrameworkData()
      setData(frameworkData)
    } catch (err) {
      console.error('加载模型框架数据失败:', err)
      setError('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="bg-gray-2 rounded-3xl p-8">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
          <h3 className="text-2xl font-bold text-primary mb-4">
            {title || '企业出海能力评估模型'}
          </h3>
          <p className="text-gray-3">正在加载模型数据...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="bg-gray-2 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-primary mb-4">
            {title || '企业出海能力评估模型'}
          </h3>
          <p className="text-gray-3 mb-6">暂时无法加载模型数据，请稍后重试</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-full hover:bg-gold transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <ModelFramework
      maturityLevels={data.maturityLevels}
      dimensions={data.dimensions}
      title={title}
      className={className}
    />
  )
}
