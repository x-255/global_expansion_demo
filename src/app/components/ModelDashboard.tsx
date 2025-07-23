'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface DashboardData {
  id: string
  name: string
  score: number
  maxScore: number
  trend: 'up' | 'down' | 'stable'
  change: number
  color: string
}

interface ModelDashboardProps {
  data: DashboardData[]
  overallScore?: number
  title?: string
  className?: string
}

export const ModelDashboard = ({ 
  data, 
  overallScore = 0,
  title = "企业能力仪表盘", 
  className = "" 
}: ModelDashboardProps) => {
  const [animationProgress, setAnimationProgress] = useState(0)
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  useEffect(() => {
    if (!inView) return

    const startTime = Date.now()
    const duration = 2500

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // 使用缓动函数
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setAnimationProgress(easeOutQuart)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [inView])

  const CircularProgress = ({ 
    value, 
    maxValue, 
    size = 120, 
    strokeWidth = 8, 
    color = '#CC4F3D',
    label,
    animated = true
  }: {
    value: number
    maxValue: number
    size?: number
    strokeWidth?: number
    color?: string
    label?: string
    animated?: boolean
  }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const percentage = (value / maxValue) * 100
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference * (animated ? animationProgress : 1)

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* 背景圆环 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* 进度圆环 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(204, 79, 61, 0.3))'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {animated ? (value * animationProgress).toFixed(1) : value.toFixed(1)}
          </span>
          {label && <span className="text-xs text-gray-3 mt-1">{label}</span>}
        </div>
      </div>
    )
  }

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    const icons = {
      up: '↗',
      down: '↘',
      stable: '→'
    }
    const colors = {
      up: 'text-green-400',
      down: 'text-red-400',
      stable: 'text-gray-3'
    }
    
    return (
      <span className={`text-lg ${colors[trend]}`}>
        {icons[trend]}
      </span>
    )
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-primary mb-4">{title}</h3>
        <p className="text-xl text-gray-3 max-w-3xl mx-auto">
          实时监控企业各项能力指标，洞察发展趋势与机遇
        </p>
      </div>

      {/* 主要仪表盘 */}
      <div className="bg-gray-2 rounded-3xl p-8 mb-8 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* 总体得分 */}
          <div className="text-center">
            <CircularProgress
              value={overallScore}
              maxValue={5}
              size={200}
              strokeWidth={12}
              color="#CC4F3D"
              label="总体评分"
            />
            <div className="mt-4">
              <div className="text-lg text-gray-3">企业综合能力</div>
              <div className="text-sm text-gray-medium mt-1">
                基于六大维度综合评估
              </div>
            </div>
          </div>

          {/* 关键指标 */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
            {data.slice(0, 6).map((item, index) => (
              <div
                key={item.id}
                className={`bg-gray-1 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  selectedMetric === item.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedMetric(selectedMetric === item.id ? null : item.id)}
                style={{
                  opacity: animationProgress,
                  transform: `translateY(${(1 - animationProgress) * 20}px)`,
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <TrendIcon trend={item.trend} />
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-3 truncate">{item.name}</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xl font-bold text-white">
                      {(item.score * animationProgress).toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-medium">
                      {item.change > 0 ? '+' : ''}{(item.change * animationProgress).toFixed(1)}
                    </span>
                  </div>
                  
                  {/* 迷你进度条 */}
                  <div className="w-full bg-gray-2 rounded-full h-1">
                    <div 
                      className="h-1 rounded-full transition-all duration-1000"
                      style={{ 
                        backgroundColor: item.color,
                        width: `${(item.score / item.maxScore) * animationProgress * 100}%`,
                        transitionDelay: `${index * 100 + 500}ms`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 详细分析 */}
      {selectedMetric && (
        <div className="bg-gray-2 rounded-3xl p-8 shadow-lg animate-fade-in">
          {(() => {
            const metric = data.find(item => item.id === selectedMetric)
            if (!metric) return null

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-4">{metric.name}</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-3">当前得分</span>
                      <span className="text-xl font-bold text-white">{metric.score.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-3">变化趋势</span>
                      <div className="flex items-center space-x-2">
                        <TrendIcon trend={metric.trend} />
                        <span className={`font-medium ${
                          metric.change > 0 ? 'text-green-400' : 
                          metric.change < 0 ? 'text-red-400' : 'text-gray-3'
                        }`}>
                          {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-3">完成度</span>
                      <span className="text-white font-medium">
                        {((metric.score / metric.maxScore) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <CircularProgress
                    value={metric.score}
                    maxValue={metric.maxScore}
                    size={160}
                    strokeWidth={10}
                    color={metric.color}
                    animated={false}
                  />
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
