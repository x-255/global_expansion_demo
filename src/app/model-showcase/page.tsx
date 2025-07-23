'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ModelRadarChart } from '../components/ModelRadarChart'
import { ModelCapabilityMatrix } from '../components/ModelCapabilityMatrix'
import { ModelDashboard } from '../components/ModelDashboard'

// 临时模拟数据，实际应用中应该从server action获取
const mockModelData = {
  dimensions: [
    {
      id: 1,
      name: '战略规划与执行能力',
      description: '企业制定和执行战略规划的综合能力',
      score: 4.2,
      maxScore: 5.0,
      level: 'L4（优化级）',
      coreCapability: '战略制定、目标管理、资源调配',
      weight: 1.0,
    },
    {
      id: 2,
      name: '跨国协作与领导力',
      description: '跨文化团队管理和国际化领导能力',
      score: 3.8,
      maxScore: 5.0,
      level: 'L3（发展级）',
      coreCapability: '团队协作、跨文化沟通、领导力',
      weight: 1.0,
    },
    {
      id: 3,
      name: '市场洞察与本地化能力',
      description: '目标市场分析和本地化适应能力',
      score: 4.5,
      maxScore: 5.0,
      level: 'L4（优化级）',
      coreCapability: '市场分析、本地化策略、客户洞察',
      weight: 1.0,
    },
    {
      id: 4,
      name: '产品与品牌标准化能力',
      description: '产品标准化和品牌国际化管理能力',
      score: 3.9,
      maxScore: 5.0,
      level: 'L3（发展级）',
      coreCapability: '产品标准化、品牌管理、质量控制',
      weight: 1.0,
    },
    {
      id: 5,
      name: '供应链与物流管理能力',
      description: '全球供应链优化和物流管理能力',
      score: 4.1,
      maxScore: 5.0,
      level: 'L4（优化级）',
      coreCapability: '供应链管理、物流优化、成本控制',
      weight: 1.0,
    },
    {
      id: 6,
      name: '风险管理与合规能力',
      description: '国际化风险识别和合规管理能力',
      score: 3.7,
      maxScore: 5.0,
      level: 'L3（发展级）',
      coreCapability: '风险识别、合规管理、危机应对',
      weight: 1.0,
    },
  ],
  overallScore: 4.03,
  maturityLevel: 'L4（优化级）',
  totalQuestions: 36,
  completedAssessments: 1,
}

// 数据转换函数
function transformToRadarData(dimensions: typeof mockModelData.dimensions) {
  return dimensions.map((dim) => ({
    dimension: dim.name,
    score: dim.score,
    maxScore: dim.maxScore,
  }))
}

function transformToCapabilityMatrix(
  dimensions: typeof mockModelData.dimensions
) {
  const colors = [
    '#CC4F3D',
    '#B79F67',
    '#3D5D6F',
    '#8DA7B8',
    '#E61717',
    '#949494',
  ]
  const icons = [
    '/check-circle.svg',
    '/globe.svg',
    '/window.svg',
    '/check-circle.svg',
    '/globe.svg',
    '/window.svg',
  ]

  return dimensions.map((dim, index) => ({
    id: dim.id.toString(),
    name: dim.name,
    description: dim.description || dim.coreCapability,
    score: dim.score,
    maxScore: dim.maxScore,
    level: dim.level,
    icon: icons[index % icons.length],
    color: colors[index % colors.length],
  }))
}

function transformToDashboard(dimensions: typeof mockModelData.dimensions) {
  const colors = [
    '#CC4F3D',
    '#B79F67',
    '#3D5D6F',
    '#8DA7B8',
    '#E61717',
    '#949494',
  ]

  return dimensions.map((dim, index) => ({
    id: dim.id.toString(),
    name: dim.name,
    score: dim.score,
    maxScore: dim.maxScore,
    trend:
      Math.random() > 0.5
        ? 'up'
        : ((Math.random() > 0.5 ? 'down' : 'stable') as
            | 'up'
            | 'down'
            | 'stable'),
    change: (Math.random() - 0.5) * 0.4,
    color: colors[index % colors.length],
  }))
}

export default function ModelShowcasePage() {
  const [modelData] = useState(mockModelData)
  const [activeView, setActiveView] = useState<
    'radar' | 'matrix' | 'dashboard'
  >('radar')
  const [loading] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
          <div className="text-xl text-gray-3">加载模型数据中...</div>
        </div>
      </div>
    )
  }

  const radarData = transformToRadarData(modelData.dimensions)
  const matrixData = transformToCapabilityMatrix(modelData.dimensions)
  const dashboardData = transformToDashboard(modelData.dimensions)

  return (
    <div className="min-h-screen bg-black">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-gray-2 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary">模型展示方案</h1>
              <div className="text-sm text-gray-3">
                总分: {modelData.overallScore.toFixed(1)} |{' '}
                {modelData.maturityLevel}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView('radar')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeView === 'radar'
                    ? 'bg-primary text-white'
                    : 'bg-gray-1 text-gray-3 hover:bg-gray-dark'
                }`}
              >
                雷达图
              </button>
              <button
                onClick={() => setActiveView('matrix')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeView === 'matrix'
                    ? 'bg-primary text-white'
                    : 'bg-gray-1 text-gray-3 hover:bg-gray-dark'
                }`}
              >
                能力矩阵
              </button>
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeView === 'dashboard'
                    ? 'bg-primary text-white'
                    : 'bg-gray-1 text-gray-3 hover:bg-gray-dark'
                }`}
              >
                仪表盘
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 方案介绍 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            企业能力评估模型展示
          </h2>
          <p className="text-xl text-gray-3 max-w-4xl mx-auto">
            基于制造业企业业务能力成熟度模型，通过多种现代化的可视化方式，
            直观展示企业在各个关键维度的能力现状与发展潜力
          </p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-2 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {modelData.dimensions.length}
            </div>
            <div className="text-gray-3">评估维度</div>
          </div>
          <div className="bg-gray-2 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-gold mb-2">
              {modelData.overallScore.toFixed(1)}
            </div>
            <div className="text-gray-3">综合得分</div>
          </div>
          <div className="bg-gray-2 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-blue mb-2">
              {modelData.totalQuestions}
            </div>
            <div className="text-gray-3">评估题目</div>
          </div>
          <div className="bg-gray-2 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {modelData.completedAssessments}
            </div>
            <div className="text-gray-3">完成评估</div>
          </div>
        </div>

        {/* 展示区域 */}
        <div className="transition-all duration-500">
          {activeView === 'radar' && (
            <div className="animate-fade-in">
              <ModelRadarChart
                data={radarData}
                title="方案一：3D雷达图展示"
                className="mb-8"
              />
              <div className="bg-gray-2 rounded-2xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">设计特点</h4>
                <p className="text-gray-3">
                  采用经典雷达图设计，直观展示各维度能力分布，支持动画效果和数据详情展示，
                  适合快速了解整体能力轮廓
                </p>
              </div>
            </div>
          )}

          {activeView === 'matrix' && (
            <div className="animate-fade-in">
              <ModelCapabilityMatrix
                data={matrixData}
                title="方案二：卡片式能力矩阵"
                className="mb-8"
              />
              <div className="bg-gray-2 rounded-2xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">设计特点</h4>
                <p className="text-gray-3">
                  采用卡片网格布局，每个维度独立展示，包含详细信息和进度指示，
                  支持悬停交互和滚动动画，适合深入了解各维度详情
                </p>
              </div>
            </div>
          )}

          {activeView === 'dashboard' && (
            <div className="animate-fade-in">
              <ModelDashboard
                data={dashboardData}
                overallScore={modelData.overallScore}
                title="方案三：交互式能力仪表盘"
                className="mb-8"
              />
              <div className="bg-gray-2 rounded-2xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">设计特点</h4>
                <p className="text-gray-3">
                  采用现代仪表盘设计，包含圆形进度指示器和趋势分析，
                  支持点击交互查看详情，适合实时监控和数据分析
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 返回首页 */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all hover:scale-105"
          >
            返回首页
          </Link>
        </div>
      </main>
    </div>
  )
}
