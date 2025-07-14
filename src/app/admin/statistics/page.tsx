'use client'

import { useState, useEffect } from 'react'
import { getStatisticsSummary } from './actions'
import { StatisticsSummary } from './types'

export default function StatisticsPage() {
  const [data, setData] = useState<StatisticsSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const summary = await getStatisticsSummary()
      setData(summary)
    } catch {
      setError('加载统计数据失败，请稍后重试')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">数据统计</h1>

      {/* 基础统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-2">注册公司数</div>
          <div className="text-3xl font-bold">{data.totalCompanies}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-2">评估次数</div>
          <div className="text-3xl font-bold">{data.totalAssessments}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-2">平均分</div>
          <div className="text-3xl font-bold">{data.averageScore.toFixed(2)}</div>
        </div>
      </div>

      {/* 行业分布 */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-bold mb-4">行业分布</h2>
        <div className="space-y-4">
          {data.industryDistribution.map(({ industry, count }) => (
            <div key={industry} className="flex items-center">
              <div className="w-32 text-sm text-gray-500">{industry}</div>
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${(count / data.totalAssessments) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="w-16 text-right text-sm text-gray-500">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 分数分布 */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-bold mb-4">分数分布</h2>
        <div className="space-y-4">
          {data.scoreDistribution.map(({ range, count }) => (
            <div key={range} className="flex items-center">
              <div className="w-32 text-sm text-gray-500">{range}</div>
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${(count / data.totalAssessments) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="w-16 text-right text-sm text-gray-500">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 维度得分对比 */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-bold mb-4">维度得分对比</h2>
        <div className="space-y-4">
          {data.dimensionScores.map(({ dimensionName, averageScore }) => (
            <div key={dimensionName} className="flex items-center">
              <div className="w-32 text-sm text-gray-500">{dimensionName}</div>
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-indigo-500"
                    style={{
                      width: `${averageScore}%`,
                    }}
                  />
                </div>
              </div>
              <div className="w-16 text-right text-sm text-gray-500">
                {averageScore.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 月度趋势 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">月度趋势</h2>
        <div className="h-64">
          <div className="h-full flex items-end">
            {data.monthlyTrend.map(({ month, assessmentCount, averageScore }) => (
              <div
                key={month}
                className="flex-1 flex flex-col items-center"
                style={{ minWidth: '60px' }}
              >
                <div className="text-xs text-gray-500 mb-2">
                  {averageScore.toFixed(1)}分
                </div>
                <div
                  className="w-8 bg-blue-500"
                  style={{
                    height: `${(assessmentCount / Math.max(...data.monthlyTrend.map(m => m.assessmentCount))) * 100}%`,
                  }}
                />
                <div className="text-xs text-gray-500 mt-2">
                  {month.slice(5)}
                </div>
                <div className="text-xs text-gray-500">
                  {assessmentCount}次
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 