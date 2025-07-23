'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { MaturityLevel, Dimension } from '@/generated/prisma/client'
import nzhcn from 'nzh/cn'

interface ModelFrameworkProps {
  maturityLevels: MaturityLevel[]
  dimensions: Dimension[]
  title?: string
  className?: string
}

export const ModelFramework = ({
  maturityLevels,
  dimensions,
  title = '企业出海能力评估模型',
  className = '',
}: ModelFrameworkProps) => {
  const [animatedItems, setAnimatedItems] = useState<Set<string>>(new Set())
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  // 为成熟度等级添加颜色和图标
  const getLevelColor = (level: number) => {
    const colors = ['#E61717', '#CC4F3D', '#B79F67', '#3D5D6F', '#8DA7B8']
    return colors[level - 1] || '#949494'
  }

  useEffect(() => {
    if (!inView) return

    // 逐个动画显示元素
    const items = [
      'title',
      ...maturityLevels.map((l) => `level-${l.level}`),
      ...dimensions.map((d, i) => `dimension-${i}`),
    ]

    items.forEach((item, index) => {
      setTimeout(() => {
        setAnimatedItems((prev) => new Set([...prev, item]))
      }, index * 200)
    })
  }, [inView, maturityLevels, dimensions])

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* 标题部分 */}
      <div
        className={`text-center mb-16 transition-all duration-700 ${
          animatedItems.has('title')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
      >
        <h3 className="text-4xl font-bold text-primary mb-4">{title}</h3>
        <p className="text-xl text-gray-3 max-w-4xl mx-auto">
          基于制造业企业业务能力成熟度模型，构建科学的六维度评估体系，
          帮助企业精准定位发展阶段，制定个性化出海战略
        </p>
      </div>

      {/* 六大维度展示 */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h4 className="text-2xl font-bold text-white mb-4">
            {nzhcn.encodeS(dimensions.length)}大核心维度
          </h4>
          <p className="text-gray-3">
            全面覆盖企业出海关键能力领域，构建完整评估体系
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dimensions.map((dimension, index) => (
            <div
              key={index}
              className={`bg-gray-2 rounded-3xl p-8 transition-all duration-700 cursor-default hover:scale-105 hover:shadow-xl group ${
                animatedItems.has(`dimension-${index}`)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: animatedItems.has(`dimension-${index}`)
                  ? '0ms'
                  : `${(index + 5) * 200}ms`,
              }}
            >
              {/* 维度图标 */}
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold transition-colors duration-300 text-2xl">
                {dimension.icon}
              </div>

              {/* 维度信息 */}
              <div className="space-y-4">
                <h5 className="text-xl font-bold text-white group-hover:text-gold transition-colors duration-300">
                  {dimension.name}
                </h5>
                <p className="text-gray-3 leading-relaxed">
                  {dimension.description}
                </p>
                <div className="pt-4 border-t border-gray-1">
                  <div className="text-sm text-gray-medium">
                    <span className="font-medium text-primary">核心能力：</span>
                    {dimension.coreCapability}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 成熟度等级展示 */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h4 className="text-2xl font-bold text-white mb-4">
            {nzhcn.encodeS(maturityLevels.length)}级成熟度模型
          </h4>
          <p className="text-gray-3">
            从初始级到卓越级，清晰定义企业出海能力发展路径
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {maturityLevels.map((level) => (
            <div
              key={level.level}
              className={`bg-gray-2 rounded-3xl p-6 text-center transition-all duration-700 cursor-default hover:scale-105 hover:shadow-xl ${
                animatedItems.has(`level-${level.level}`)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: animatedItems.has(`level-${level.level}`)
                  ? '0ms'
                  : `${level.level * 200}ms`,
              }}
            >
              {/* 等级图标和编号 */}
              <div className="mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl"
                  style={{ backgroundColor: getLevelColor(level.level) }}
                >
                  {level.icon}
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: getLevelColor(level.level) }}
                >
                  L{level.level}
                </div>
              </div>

              {/* 等级信息 */}
              <div className="space-y-3">
                <h5 className="text-lg font-bold text-white">
                  {level.name.split('（')[1]?.replace('）', '') || level.name}
                </h5>
                <p className="text-gray-3 text-sm leading-relaxed">
                  {level.description}
                </p>
                <div className="pt-2 border-t border-gray-1">
                  <p className="text-xs text-gray-medium leading-relaxed">
                    {level.coreFeatures.length > 60
                      ? level.coreFeatures.substring(0, 60) + '...'
                      : level.coreFeatures}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 模型特点 */}
      <div className="bg-gray-2 rounded-3xl p-8 text-center">
        <h4 className="text-2xl font-bold text-primary mb-6">模型核心特点</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: '科学性', desc: '基于国际标准成熟度模型', icon: '🔬' },
            { title: '全面性', desc: '覆盖出海全流程关键环节', icon: '🌐' },
            { title: '实用性', desc: '提供可操作的改进建议', icon: '🛠️' },
            { title: '动态性', desc: '支持持续跟踪和优化', icon: '📈' },
          ].map((feature, index) => (
            <div key={index} className="bg-gray-1 rounded-2xl p-6">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h5 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h5>
              <p className="text-gray-3 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
