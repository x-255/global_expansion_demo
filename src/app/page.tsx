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
      description:
        '基于制造业企业业务能力成熟度模型，结合国际化发展特点，提供全面的能力评估',
      icon: '/check-circle.svg',
    },
    {
      title: 'AI智能分析',
      description:
        '运用先进的AI技术，对企业数据进行深度分析，提供个性化的发展建议',
      icon: '/globe.svg',
    },
    {
      title: '一站式解决方案',
      description: '从评估到建议，再到具体实施方案，提供完整的企业出海支持',
      icon: '/window.svg',
    },
  ]

  const steps = [
    {
      number: '01',
      title: '能力自测',
      description:
        '通过科学问卷，系统评估制造业企业的业务能力成熟度，精准定位发展阶段',
    },
    {
      number: '02',
      title: '获取专属报告',
      description: '自动生成详尽的成熟度分析报告，清晰展现企业优势与短板',
    },
    {
      number: '03',
      title: '出海能力评估',
      description: '基于成熟度模型，深入诊断企业的国际化与出海准备度',
    },
    {
      number: '04',
      title: 'AI智能出海方案',
      description: 'AI驱动，一站式定制企业专属的智能化出海提升与落地解决方案',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <DynamicBackground />

      {/* 主要内容区域 */}
      <main className="flex-grow pt-12 bg-black">
        {/* Hero部分 */}
        <section className="relative flex items-center justify-center py-20 overflow-hidden bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              <h1 className="text-6xl font-bold mb-6 text-primary">
                全球化发展
                <br />
                <span className="text-gold">从这里起航</span>
              </h1>
              <p className="text-xl text-gray-3 mb-6 max-w-2xl mx-auto">
                通过科学的评估体系和AI智能分析，帮助企业发现优势与短板，
                制定精准的国际化发展战略。
              </p>
            </div>
          </div>
        </section>

        {/* 特色功能部分 */}
        <section
          id="features"
          className="py-32 relative overflow-hidden bg-black"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 animate-fade-in">
              <h2 className="text-4xl font-bold mb-4 text-primary">特色功能</h2>
              <p className="text-xl text-gray-dark max-w-2xl mx-auto">
                我们提供全面的企业出海能力评估解决方案，助力企业在全球市场取得成功
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="animate-scale-float bg-gray-2 rounded-3xl p-8 shadow-md transition-all duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mb-6">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={32}
                      height={32}
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-primary">
                    <span className="text-white">{feature.title}</span>
                  </h3>
                  <p className="text-white leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 评估流程部分 */}
        <section id="process" className="py-32 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-4 text-primary">评估流程</h2>
              <p className="text-xl text-gray-dark max-w-2xl mx-auto">
                简单四步，帮助您全面了解企业出海能力现状，获取专业改进建议
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative animate-float h-full"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="bg-gray-2 rounded-3xl p-8 shadow-md h-full flex flex-col">
                    <div className="text-5xl font-bold text-primary/20 mb-6">
                      <span className="text-gold">{step.number}</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">
                      <span className="text-white">{step.title}</span>
                    </h3>
                    <p className="text-white flex-1">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <Image
                        src="/arrow-right.svg"
                        alt="箭头"
                        width={24}
                        height={24}
                        className="opacity-30"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 开始评估部分 */}
        <section id="start" className="py-32 bg-black">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-2 rounded-3xl p-12 shadow-md">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-primary">
                  <span className="text-white">开始您的评估之旅</span>
                </h2>
                <p className="text-xl text-white">
                  输入企业名称，立即获取专业的出海能力评估报告
                </p>
              </div>

              <form onSubmit={handleStartAssessment} className="space-y-6">
                <div>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="请输入企业名称"
                    className="w-full px-6 py-4 text-lg border border-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-shadow bg-gray-2 text-white"
                    required
                  />
                  {error && <p className="mt-2 text-sm text-danger">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-apple text-lg py-4 bg-primary text-white hover:bg-gold"
                >
                  {isLoading ? '处理中...' : '立即开始评估'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-white mb-6">完成评估后，您将获得：</p>
                <div className="grid grid-cols-2 gap-6 text-left">
                  {[
                    '出海能力成熟度评估模型',
                    '详细的能力评估报告',
                    '行业对标分析',
                    'AI增强的智能化一站式企业出海解决方案',
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-2 rounded-xl p-4 shadow-sm"
                    >
                      <Image
                        src="/check-circle.svg"
                        alt="检查"
                        width={20}
                        height={20}
                        className="mr-3"
                      />
                      <span className="text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-black py-16 border-t border-gray-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-8 md:mb-0">
              <Image
                src="/globe.svg"
                alt="Logo"
                width={32}
                height={32}
                className="mr-3"
              />
              <span className="text-xl font-bold text-primary">
                企业出海能力评估
              </span>
            </div>
            <div className="text-sm text-gray-3">
              © {new Date().getFullYear()} 企业出海能力评估. All rights
              reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
