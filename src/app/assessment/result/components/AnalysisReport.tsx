interface Props {
  dimensions: {
    id: number
    name: string
    score: number
    averageScore: number
  }[]
}

const getDimensionLevel = (
  score: number
): { level: string; description: string; color: string } => {
  if (score >= 90) {
    return {
      level: '卓越水平',
      description: '该维度表现极其出色，具有显著竞争优势',
      color: 'bg-emerald-500',
    }
  } else if (score >= 80) {
    return {
      level: '优势水平',
      description: '该维度表现优秀，具备明显竞争力',
      color: 'bg-blue-500',
    }
  } else if (score >= 70) {
    return {
      level: '良好水平',
      description: '该维度表现稳定，符合发展预期',
      color: 'bg-sky-500',
    }
  } else if (score >= 60) {
    return {
      level: '基础水平',
      description: '该维度达到基本要求，仍需持续提升',
      color: 'bg-amber-500',
    }
  } else if (score >= 45) {
    return {
      level: '待加强',
      description: '该维度有明显不足，需要系统性改进',
      color: 'bg-orange-500',
    }
  } else if (score >= 30) {
    return {
      level: '薄弱',
      description: '该维度存在严重短板，亟需重点提升',
      color: 'bg-rose-500',
    }
  } else {
    return {
      level: '危险',
      description: '该维度表现极差，可能制约整体发展',
      color: 'bg-red-500',
    }
  }
}

export function AnalysisReport({ dimensions }: Props) {
  // 按分数从高到低排序
  const sortedDimensions = [...dimensions].sort((a, b) => b.score - a.score)

  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-xl">
      <h2 className="text-2xl font-semibold mb-6">维度分析</h2>
      <div className="space-y-4">
        {sortedDimensions.map((dimension) => {
          const { level, description, color } = getDimensionLevel(
            dimension.score
          )

          return (
            <div
              key={dimension.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium text-gray-800">
                    {dimension.name}
                  </h3>
                  <div
                    className={`${color} text-white font-medium px-4 py-1.5 rounded-full text-sm`}
                  >
                    {level}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500">得分</div>
                    <div className="text-2xl font-semibold mt-1">
                      {dimension.score}分
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">行业平均分</div>
                    <div className="text-2xl font-semibold mt-1">
                      {dimension.averageScore}分
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50">
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
