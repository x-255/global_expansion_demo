import { useEffect, useState } from 'react'
import {
  getMaturityLevelByScore,
  getDimensionStrategyByScore,
} from '../actions'

interface Props {
  dimensions: {
    id: number
    name: string
    score: number
    weight: number
    averageScore: number
  }[]
  totalScore: number
}

interface DimensionAnalysis {
  level: string
  description: string
  color: string
  coreFeatures: string
  definition: string
  strategies: {
    content: string
    order: number
  }[]
}

// 获取等级对应的颜色
function getLevelColor(level: number): string {
  switch (level) {
    case 5:
      return 'bg-primary'
    case 4:
      return 'bg-gold'
    case 3:
      return 'bg-blue'
    case 2:
      return 'bg-blue-light'
    default:
      return 'bg-gray-dark'
  }
}

export function AnalysisReport({ dimensions, totalScore }: Props) {
  const [overallAnalysis, setOverallAnalysis] =
    useState<DimensionAnalysis | null>(null)
  const [dimensionAnalyses, setDimensionAnalyses] = useState<
    Map<number, DimensionAnalysis>
  >(new Map())

  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        // 获取总体分析
        const overallLevel = await getMaturityLevelByScore(totalScore)
        if (overallLevel) {
          setOverallAnalysis({
            level: overallLevel.name,
            description: overallLevel.description,
            color: getLevelColor(overallLevel.level),
            coreFeatures: overallLevel.coreFeatures,
            definition: '',
            strategies: overallLevel.strategies.flatMap((s) =>
              s.actions.map((a) => ({
                content: a.content,
                order: a.order,
              }))
            ),
          })
        }

        // 获取每个维度的分析
        const analyses = new Map<number, DimensionAnalysis>()
        for (const dimension of dimensions) {
          const result = await getDimensionStrategyByScore(
            dimension.score,
            dimension.id
          )
          if (result && result.dimensionStrategy) {
            analyses.set(dimension.id, {
              level: result.name,
              description: result.description,
              color: getLevelColor(result.level),
              coreFeatures: result.coreFeatures,
              definition: result.dimensionStrategy.definition,
              strategies: result.dimensionStrategy.actions.map((a) => ({
                content: a.content,
                order: a.order,
              })),
            })
          }
        }
        setDimensionAnalyses(analyses)
      } catch (error) {
        console.error('加载分析失败:', error)
      }
    }

    loadAnalyses()
  }, [dimensions, totalScore])

  // 按分数从高到低排序
  const sortedDimensions = [...dimensions].sort((a, b) => b.score - a.score)

  return (
    <div className="mt-12 space-y-8">
      {/* 总体分析 */}
      {overallAnalysis && (
        <div className="p-6 bg-gray-1 rounded-xl">
          <h2 className="text-2xl font-semibold mb-6 text-white">总体分析</h2>
          <div className="bg-gray-2 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-dark">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-white">整体成熟度</h3>
                <div
                  className={`${overallAnalysis.color} text-white font-medium px-4 py-1.5 rounded-full text-sm`}
                >
                  {overallAnalysis.level}
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-3">总体得分</div>
                <div className="text-2xl font-semibold mt-1 text-gold">
                  {totalScore}分
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-1">
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">当前状态</h4>
                  <p className="text-gray-3 text-sm">
                    {overallAnalysis.description}
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">核心特征</h4>
                  <p className="text-gray-3 text-sm">
                    {overallAnalysis.coreFeatures}
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">建议策略</h4>
                  <div className="space-y-2">
                    {overallAnalysis.strategies.map((strategy, index) => (
                      <div key={index} className="bg-gray-2 p-3 rounded">
                        <p className="text-gray-3 text-sm">
                          {strategy.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 维度分析 */}
      <div className="p-6 bg-gray-1 rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-white">维度分析</h2>
        <div className="space-y-4">
          {sortedDimensions.map((dimension) => {
            const analysis = dimensionAnalyses.get(dimension.id)
            if (!analysis) return null

            return (
              <div
                key={dimension.id}
                className="bg-gray-2 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-4 border-b border-gray-dark">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-medium text-white">
                      {dimension.name}
                    </h3>
                    <div
                      className={`${analysis.color} text-white font-medium px-4 py-1.5 rounded-full text-sm`}
                    >
                      {analysis.level}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-3">得分</div>
                      <div className="text-2xl font-semibold mt-1 text-gold">
                        {dimension.score}分
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-3">行业平均分</div>
                      <div className="text-2xl font-semibold mt-1 text-gold">
                        {dimension.averageScore}分
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-1">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">当前状态</h4>
                      <p className="text-gray-3 text-sm">
                        {analysis.definition}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">核心特征</h4>
                      <p className="text-gray-3 text-sm">
                        {analysis.coreFeatures}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">建议策略</h4>
                      <div className="space-y-2">
                        {analysis.strategies.map((strategy, index) => (
                          <div key={index} className="bg-gray-2 p-3 rounded">
                            <p className="text-gray-3 text-sm">
                              {strategy.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
