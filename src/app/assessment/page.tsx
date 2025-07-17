'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAssessmentStore } from '../store/assessment'
import { getDimensions, validateCompany, saveAssessment } from './actions'
import { getCompanyCookie } from '@/lib/cookies'
import CalculatingAnimation from './components/CalculatingAnimation'
import { Question } from './components/Question'
import { ProgressBar } from './components/ProgressBar'
import { NavigationButtons } from './components/NavigationButtons'
import type {
  Dimension as PrismaDimension,
  Question as PrismaQuestion,
  QuestionOption,
} from '@/generated/prisma/client'

interface Question extends PrismaQuestion {
  options: QuestionOption[]
}

interface Dimension extends PrismaDimension {
  questions: Question[]
}

export default function AssessmentPage() {
  const router = useRouter()
  const [groupIdx, setGroupIdx] = useState(0)
  const [dimensions, setDimensions] = useState<Dimension[]>([])
  const { answers, setAnswers, hydrated } = useAssessmentStore()
  const [isSimulating, setIsSimulating] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 创建问题元素的refs
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])

  // 验证公司并加载维度和题目数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 从 cookie 获取公司信息
        const companyName = await getCompanyCookie()
        if (!companyName) {
          router.push('/')
          return
        }

        const company = await validateCompany(companyName)
        if (!company) {
          router.push('/')
          return
        }

        const dimensionsData = await getDimensions()
        if (!dimensionsData || dimensionsData.length === 0) {
          throw new Error('未找到评估数据')
        }
        // 过滤掉没有题目的维度
        const filteredDimensions = dimensionsData.filter(
          (d) => d.questions.length > 0
        )
        if (filteredDimensions.length === 0) {
          throw new Error('未找到有效的评估数据')
        }
        setDimensions(filteredDimensions)

        // 等待 store hydration 完成后再处理答案
        if (hydrated) {
          if (!answers || answers.length === 0) {
            // 初始化空的答案数组
            const initialAnswers = filteredDimensions.flatMap((dim) =>
              dim.questions.map((q) => ({
                questionId: q.id,
                answer: null,
              }))
            )
            setAnswers(initialAnswers)
          }
        }
        setLoading(false)
      } catch (error) {
        console.error('加载数据失败:', error)
        setError(
          error instanceof Error ? error.message : '加载数据失败，请稍后重试'
        )
        setLoading(false)
      }
    }

    if (hydrated) {
      loadData()
    }
  }, [hydrated, answers, setAnswers, router])

  // 初始化时检查已回答的题目，自动切换到最后回答的组别
  useEffect(() => {
    if (answers && answers.length > 0 && dimensions.length > 0) {
      const lastAnsweredGroup = dimensions.reduce(
        (lastGroup, dimension, currentGroup) => {
          const hasAnswers = dimension.questions.some((q) =>
            answers.some((a) => a.questionId === q.id && a.answer !== null)
          )
          return hasAnswers ? currentGroup : lastGroup
        },
        0
      )

      if (lastAnsweredGroup > 0) {
        setGroupIdx(lastAnsweredGroup)
      }
    }
  }, [answers, dimensions])

  // 当组别改变时，滚动到第一个问题
  useEffect(() => {
    if (questionRefs.current[0]) {
      questionRefs.current[0].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [groupIdx])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-black">
        <div className="text-danger text-lg">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-gold transition-colors"
        >
          重新加载
        </button>
      </div>
    )
  }

  if (dimensions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gray-3">暂无评估数据</div>
      </div>
    )
  }

  // 当前组所有题目是否已作答
  const currentGroupAllAnswered = dimensions[groupIdx].questions.every((q) =>
    answers.some((a) => a.questionId === q.id && a.answer !== null)
  )

  // 计算总体完成度
  const totalQuestions = dimensions.reduce(
    (sum, d) => sum + d.questions.length,
    0
  )
  const answeredCount = answers.filter((a) => a.answer !== null).length
  const progress = Math.round((answeredCount / totalQuestions) * 100)

  const handleSelect = (qIdx: number, optIdx: number) => {
    const questionId = dimensions[groupIdx].questions[qIdx].id
    const newAnswers = answers.map((a) =>
      a.questionId === questionId ? { ...a, answer: optIdx } : a
    )
    setAnswers(newAnswers)

    // 如果不是最后一个问题，滚动到下一个问题
    if (qIdx < dimensions[groupIdx].questions.length - 1) {
      setTimeout(() => {
        questionRefs.current[qIdx + 1]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 300)
    }
  }

  // 模拟评估功能
  const simulateAssessment = () => {
    setIsSimulating(true)

    // 生成所有答案
    const newAnswers = dimensions.flatMap((dim) =>
      dim.questions.map((q) => ({
        questionId: q.id,
        answer: Math.floor(Math.random() * 5),
      }))
    )
    setAnswers(newAnswers)

    // 跳转到最后一组
    setGroupIdx(dimensions.length - 1)
    setIsSimulating(false)
  }

  const handleComplete = async () => {
    try {
      setIsCalculating(true)
      const companyName = await getCompanyCookie()

      if (!companyName) {
        throw new Error('未找到公司信息')
      }

      // 确保所有问题都已回答
      if (!answers || answers.some((a) => a.answer === null)) {
        throw new Error('请回答所有问题后再提交')
      }

      // 保存评估结果
      const validAnswers = answers.map((a) => ({
        questionId: a.questionId,
        answer: a.answer as number,
      }))
      await saveAssessment(companyName, validAnswers)

      // 延迟跳转以显示计算动画
      setTimeout(() => {
        router.push('/assessment/result')
      }, 2500)
    } catch (error) {
      setError(error instanceof Error ? error.message : '保存评估结果失败')
      setIsCalculating(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black py-8">
      {isCalculating && <CalculatingAnimation />}
      <div className="w-full max-w-4xl mx-auto">
        {/* sticky 标题和进度条 */}
        <div className="sticky top-0 z-20 w-full bg-gray-2 rounded-t-2xl shadow-sm px-8 pt-8 pb-4">
          {/* 模拟评估按钮 */}
          <button
            onClick={simulateAssessment}
            disabled={isSimulating}
            className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all
                ${
                  isSimulating
                    ? 'bg-gray-4 text-gray-dark cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-gold'
                }`}
          >
            {isSimulating ? '模拟中...' : '模拟评估'}
          </button>
          <h2 className="text-3xl font-bold text-primary mb-2">
            {dimensions[groupIdx].name}
          </h2>
          <p className="text-white mb-4">{dimensions[groupIdx].description}</p>
          <ProgressBar
            progress={progress}
            currentGroup={groupIdx}
            totalGroups={dimensions.length}
          />
        </div>

        {/* 当前组所有题目 */}
        <div className="bg-gray-2 px-10 py-5">
          {dimensions[groupIdx].questions.map((q, qIdx) => {
            const answer = answers.find((a) => a.questionId === q.id)
            return (
              <Question
                key={qIdx}
                question={q}
                qIdx={qIdx}
                isAnswered={answer?.answer !== null}
                selectedOption={answer?.answer ?? null}
                onSelect={handleSelect}
                ref={(el) => {
                  questionRefs.current[qIdx] = el
                }}
              />
            )
          })}
        </div>

        <div className="bg-gray-2 rounded-b-2xl shadow-sm">
          <NavigationButtons
            groupIdx={groupIdx}
            totalGroups={dimensions.length}
            isCurrentGroupAnswered={currentGroupAllAnswered}
            onPrevious={() => setGroupIdx((g) => Math.max(0, g - 1))}
            onNext={() =>
              setGroupIdx((g) => Math.min(dimensions.length - 1, g + 1))
            }
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  )
}
