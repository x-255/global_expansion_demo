'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOrCreateCompany } from './actions'
import { useAssessmentStore } from './store/assessment'
import Image from 'next/image'
import { DynamicBackground } from './components/DynamicBackground'

export default function Home() {
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { clearAnswers } = useAssessmentStore()

  const handleStartAssessment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await getOrCreateCompany(companyName)
      clearAnswers()
      router.push('/assessment')
    } catch (error) {
      setError(error instanceof Error ? error.message : '发生未知错误')
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      title: '科学的评估模型',
      description: '基于制造业企业业务能力成熟度模型，结合国际化发展特点，提供全面的能力评估',
      icon: '/check-circle.svg'
    },
    {
      title: 'AI智能分析',
      description: '运用先进的AI技术，对企业数据进行深度分析，提供个性化的发展建议',
      icon: '/globe.svg'
    },
    {
      title: '一站式解决方案',
      description: '从评估到建议，再到具体实施方案，提供完整的企业出海支持',
      icon: '/window.svg'
    }
  ]

  const steps = [
    {
      number: '01',
      title: '注册企业',
      description: '输入企业名称，系统自动为您创建企业档案'
    },
    {
      number: '02',
      title: '完成评估',
      description: '回答精心设计的评估问题，全面了解企业现状'
    },
    {
      number: '03',
      title: '获取报告',
      description: '系统生成专业的分析报告，提供详细的改进建议'
    },
    {
      number: '04',
      title: '执行方案',
      description: '根据建议制定并实施改进计划，提升企业竞争力'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <DynamicBackground />
      
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/globe.svg" alt="Logo" width={24} height={24} className="mr-2" />
            <span className="text-lg font-medium text-gray-900">企业出海能力评估</span>
          </div>
          <div className="flex items-center space-x-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">特色功能</a>
            <a href="#process" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">评估流程</a>
            <a href="#start" className="btn-apple text-sm">开始评估</a>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="flex-grow pt-12">
        {/* Hero部分 */}
        <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              <h1 className="text-6xl font-bold mb-6">
                <span className="gradient-text">全球化发展</span>
                <br />
                从这里起航
              </h1>
              <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                通过科学的评估体系和AI智能分析，帮助企业发现优势与短板，
                制定精准的国际化发展战略。
              </p>
            </div>
          </div>
        </section>

        {/* 特色功能部分 */}
        <section id="features" className="py-32 relative overflow-hidden bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 animate-fade-in">
              <h2 className="text-4xl font-bold mb-4">特色功能</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                我们提供全面的企业出海能力评估解决方案，助力企业在全球市场取得成功
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="animate-scale-float bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                    <Image src={feature.icon} alt={feature.title} width={32} height={32} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 评估流程部分 */}
        <section id="process" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-4">评估流程</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                简单四步，帮助您全面了解企业出海能力现状，获取专业改进建议
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative animate-float" style={{animationDelay: `${index * 0.2}s`}}>
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-5xl font-bold text-primary/20 mb-6">{step.number}</div>
                    <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <Image src="/arrow-right.svg" alt="箭头" width={24} height={24} className="opacity-30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 开始评估部分 */}
        <section id="start" className="py-32 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-primary/5 to-purple-50 rounded-3xl p-12 shadow-xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">开始您的评估之旅</h2>
                <p className="text-xl text-gray-600">
                  输入企业名称，立即获取专业的出海能力评估报告
                </p>
              </div>

              <form onSubmit={handleStartAssessment} className="space-y-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    企业名称
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="请输入企业名称"
                    className="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    required
                  />
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-apple text-lg py-4"
                >
                  {isLoading ? '处理中...' : '立即开始评估'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-6">完成评估后，您将获得：</p>
                <div className="grid grid-cols-2 gap-6 text-left">
                  {[
                    '详细的能力评估报告',
                    '专业团队的改进建议',
                    '个性化发展方案',
                    '行业对标分析'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center bg-white/50 rounded-xl p-4 shadow-sm">
                      <Image src="/check-circle.svg" alt="检查" width={20} height={20} className="mr-3" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-8 md:mb-0">
              <Image src="/globe.svg" alt="Logo" width={32} height={32} className="mr-3" />
              <span className="text-xl font-bold gradient-text">企业出海能力评估</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} 企业出海能力评估. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
