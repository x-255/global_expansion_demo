'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface RadarData {
  dimension: string
  score: number
  maxScore: number
}

interface ModelRadarChartProps {
  data: RadarData[]
  title?: string
  className?: string
}

export const ModelRadarChart = ({
  data,
  title = '企业能力评估模型',
  className = '',
}: ModelRadarChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  useEffect(() => {
    if (!inView) return

    const startTime = Date.now()
    const duration = 2000 // 2秒动画

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // 使用缓动函数
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      setAnimationProgress(easeOutCubic)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [inView])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) - 80

    // 清空画布
    ctx.clearRect(0, 0, rect.width, rect.height)

    // 绘制背景网格
    drawGrid(ctx, centerX, centerY, radius)

    // 绘制数据区域
    drawDataArea(ctx, centerX, centerY, radius, data, animationProgress)

    // 绘制标签
    drawLabels(ctx, centerX, centerY, radius, data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, animationProgress])

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    const levels = 5

    // 绘制同心圆
    for (let i = 1; i <= levels; i++) {
      const r = (radius * i) / levels
      ctx.beginPath()
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // 绘制射线
    const angleStep = (Math.PI * 2) / data.length
    for (let i = 0; i < data.length; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }

  const drawDataArea = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    data: RadarData[],
    progress: number
  ) => {
    if (data.length === 0) return

    const angleStep = (Math.PI * 2) / data.length
    const points: { x: number; y: number }[] = []

    // 计算所有点的位置
    for (let i = 0; i < data.length; i++) {
      const angle = i * angleStep - Math.PI / 2
      const normalizedScore = data[i].score / data[i].maxScore
      const pointRadius = radius * normalizedScore * progress

      const x = centerX + Math.cos(angle) * pointRadius
      const y = centerY + Math.sin(angle) * pointRadius
      points.push({ x, y })
    }

    // 绘制填充区域
    if (points.length > 0) {
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.closePath()

      // 创建渐变
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      )
      gradient.addColorStop(0, 'rgba(204, 79, 61, 0.3)')
      gradient.addColorStop(1, 'rgba(204, 79, 61, 0.1)')

      ctx.fillStyle = gradient
      ctx.fill()

      // 绘制边框
      ctx.strokeStyle = '#CC4F3D'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // 绘制数据点
    points.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#CC4F3D'
      ctx.fill()
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2
      ctx.stroke()
    })
  }

  const drawLabels = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    data: RadarData[]
  ) => {
    const angleStep = (Math.PI * 2) / data.length

    ctx.font = '14px -apple-system, BlinkMacSystemFont, SF Pro Text, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let i = 0; i < data.length; i++) {
      const angle = i * angleStep - Math.PI / 2
      const labelRadius = radius + 30
      const x = centerX + Math.cos(angle) * labelRadius
      const y = centerY + Math.sin(angle) * labelRadius

      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(data[i].dimension, x, y)
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-primary mb-2">{title}</h3>
        <p className="text-gray-3">基于六大核心维度的综合能力评估</p>
      </div>

      <div className="relative bg-gray-2 rounded-3xl p-8 shadow-lg">
        <canvas
          ref={canvasRef}
          className="w-full h-96"
          style={{ width: '100%', height: '384px' }}
        />

        {/* 数据详情 */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-gray-1 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 0.1}s`,
                opacity: animationProgress,
                transform: `translateY(${(1 - animationProgress) * 20}px)`,
              }}
            >
              <div className="text-primary font-bold text-lg">
                {(item.score * animationProgress).toFixed(1)}
              </div>
              <div className="text-gray-3 text-sm mt-1">{item.dimension}</div>
              <div className="w-full bg-gray-3 rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${
                      (item.score / item.maxScore) * animationProgress * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
