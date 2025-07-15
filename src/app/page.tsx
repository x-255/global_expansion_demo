'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOrCreateCompany } from './actions'
import Image from 'next/image'

export default function Home() {
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleStartAssessment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await getOrCreateCompany(companyName)
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/globe.svg" alt="Logo" width={32} height={32} className="mr-2" />
            <span className="text-xl font-bold text-blue-700">企业出海能力评估</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#features" className="text-gray-600 hover:text-blue-600">特色功能</a>
            <a href="#process" className="text-gray-600 hover:text-blue-600">评估流程</a>
            <a href="#start" className="text-gray-600 hover:text-blue-600">开始评估</a>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="flex-grow">
        {/* Hero部分 */}
        <section className="relative py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                助力中国企业
                <span className="text-blue-600">全球化发展</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                通过科学的评估体系和AI智能分析，帮助企业发现优势与短板，
                制定精准的国际化发展战略。
              </p>
              <div className="flex justify-center space-x-4">
                <a 
                  href="#start" 
                  className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold shadow hover:bg-blue-700 transition"
                >
                  免费开始评估
                </a>
                <a 
                  href="#features" 
                  className="px-8 py-3 bg-white text-blue-600 rounded-full text-lg font-semibold shadow hover:bg-gray-50 transition"
                >
                  了解更多
                </a>
              </div>
            </div>
          </div>
          {/* 背景装饰 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transform rotate-12"></div>
          </div>
        </section>

        {/* 特色功能部分 */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">特色功能</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                我们提供全面的企业出海能力评估解决方案，助力企业在全球市场取得成功
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Image src={feature.icon} alt={feature.title} width={24} height={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 评估流程部分 */}
        <section id="process" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">评估流程</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                简单四步，帮助您全面了解企业出海能力现状，获取专业改进建议
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition h-full">
                    <div className="text-4xl font-bold text-blue-600 mb-4">{step.number}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <Image src="/arrow-right.svg" alt="箭头" width={24} height={24} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 开始评估部分 */}
        <section id="start" className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">开始您的评估之旅</h2>
                <p className="text-gray-600">
                  输入企业名称，立即获取专业的出海能力评估报告
                </p>
              </div>

              <form onSubmit={handleStartAssessment} className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    企业名称
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="请输入企业名称"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold shadow 
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} transition`}
                >
                  {isLoading ? '处理中...' : '立即开始评估'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                完成评估后，您将获得：
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center">
                    <Image src="/check-circle.svg" alt="检查" width={16} height={16} className="mr-2" />
                    <span>详细的能力评估报告</span>
                  </div>
                  <div className="flex items-center">
                    <Image src="/check-circle.svg" alt="检查" width={16} height={16} className="mr-2" />
                    <span>AI生成的改进建议</span>
                  </div>
                  <div className="flex items-center">
                    <Image src="/check-circle.svg" alt="检查" width={16} height={16} className="mr-2" />
                    <span>个性化发展方案</span>
                  </div>
                  <div className="flex items-center">
                    <Image src="/check-circle.svg" alt="检查" width={16} height={16} className="mr-2" />
                    <span>行业对标分析</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Image src="/globe.svg" alt="Logo" width={32} height={32} className="mr-2" />
                <span className="text-xl font-bold text-blue-700">企业出海能力评估</span>
              </div>
              <p className="text-gray-600">
                助力中国企业在全球市场实现可持续发展
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">快速链接</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-blue-600">特色功能</a></li>
                <li><a href="#process" className="text-gray-600 hover:text-blue-600">评估流程</a></li>
                <li><a href="#start" className="text-gray-600 hover:text-blue-600">开始评估</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">联系我们</h3>
              <p className="text-gray-600">
                如果您有任何问题或建议，请随时与我们联系
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} 企业出海能力评估. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
