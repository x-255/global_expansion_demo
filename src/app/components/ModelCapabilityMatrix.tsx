'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

interface CapabilityData {
  id: string
  name: string
  description: string
  score: number
  maxScore: number
  level: string
  icon: string
  color: string
}

interface ModelCapabilityMatrixProps {
  data: CapabilityData[]
  title?: string
  className?: string
}

export const ModelCapabilityMatrix = ({ 
  data, 
  title = "企业能力成熟度矩阵", 
  className = "" 
}: ModelCapabilityMatrixProps) => {
  const [animatedCards, setAnimatedCards] = useState<Set<string>>(new Set())
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  useEffect(() => {
    if (!inView) return

    // 逐个动画显示卡片
    data.forEach((item, index) => {
      setTimeout(() => {
        setAnimatedCards(prev => new Set([...prev, item.id]))
      }, index * 150)
    })
  }, [inView, data])

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = score / maxScore
    if (percentage >= 0.8) return 'text-green-400'
    if (percentage >= 0.6) return 'text-gold'
    if (percentage >= 0.4) return 'text-yellow-400'
    return 'text-primary'
  }

  const getProgressColor = (score: number, maxScore: number) => {
    const percentage = score / maxScore
    if (percentage >= 0.8) return 'bg-green-400'
    if (percentage >= 0.6) return 'bg-gold'
    if (percentage >= 0.4) return 'bg-yellow-400'
    return 'bg-primary'
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-primary mb-4">{title}</h3>
        <p className="text-xl text-gray-3 max-w-3xl mx-auto">
          深度解析企业在各个关键维度的能力现状，为战略决策提供数据支撑
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item, index) => {
          const isAnimated = animatedCards.has(item.id)
          const percentage = (item.score / item.maxScore) * 100

          return (
            <div
              key={item.id}
              className={`group relative bg-gray-2 rounded-3xl p-8 shadow-lg transition-all duration-700 hover:shadow-2xl hover:scale-105 ${
                isAnimated 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isAnimated ? '0ms' : `${index * 150}ms`
              }}
            >
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 overflow-hidden rounded-tr-3xl">
                <div 
                  className="w-full h-full transform rotate-12 scale-150"
                  style={{ backgroundColor: item.color }}
                />
              </div>

              {/* 图标区域 */}
              <div className="relative mb-6">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: item.color }}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={32}
                    height={32}
                    className="filter brightness-0 invert"
                  />
                </div>
                
                {/* 分数显示 */}
                <div className="absolute top-0 right-0">
                  <div className={`text-3xl font-bold ${getScoreColor(item.score, item.maxScore)}`}>
                    {isAnimated ? item.score.toFixed(1) : '0.0'}
                  </div>
                  <div className="text-gray-3 text-sm">/ {item.maxScore}</div>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors duration-300">
                    {item.name}
                  </h4>
                  <p className="text-gray-3 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* 等级标签 */}
                <div className="flex items-center justify-between">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.level}
                  </span>
                  <span className="text-gray-3 text-sm">
                    {percentage.toFixed(0)}%
                  </span>
                </div>

                {/* 进度条 */}
                <div className="space-y-2">
                  <div className="w-full bg-gray-1 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(item.score, item.maxScore)}`}
                      style={{ 
                        width: isAnimated ? `${percentage}%` : '0%',
                        transitionDelay: `${index * 150 + 300}ms`
                      }}
                    />
                  </div>
                  
                  {/* 进度条刻度 */}
                  <div className="flex justify-between text-xs text-gray-3">
                    <span>初级</span>
                    <span>中级</span>
                    <span>高级</span>
                    <span>专家</span>
                  </div>
                </div>
              </div>

              {/* 悬停效果 */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          )
        })}
      </div>

      {/* 总体统计 */}
      <div className="mt-16 bg-gray-2 rounded-3xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">
              {data.length}
            </div>
            <div className="text-gray-3">评估维度</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gold">
              {(data.reduce((sum, item) => sum + item.score, 0) / data.length).toFixed(1)}
            </div>
            <div className="text-gray-3">平均得分</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-400">
              {data.filter(item => item.score / item.maxScore >= 0.7).length}
            </div>
            <div className="text-gray-3">优势维度</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-yellow-400">
              {data.filter(item => item.score / item.maxScore < 0.5).length}
            </div>
            <div className="text-gray-3">待提升维度</div>
          </div>
        </div>
      </div>
    </div>
  )
}
