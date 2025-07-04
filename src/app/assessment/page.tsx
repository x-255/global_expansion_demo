'use client'
import React, { useState, useRef, useEffect } from 'react'
import { dimensions } from './assessmentModel'
import { useAssessmentStore } from '../store/assessment'
import { useRouter } from 'next/navigation'
import CalculatingAnimation from './components/CalculatingAnimation'
import { Question } from './components/Question'
import { ProgressBar } from './components/ProgressBar'
import { NavigationButtons } from './components/NavigationButtons'

export default function AssessmentPage() {
  const router = useRouter()
  const [groupIdx, setGroupIdx] = useState(0)
  const { answers, setAnswers } = useAssessmentStore()
  const [hovered, setHovered] = useState<{
    qIdx: number
    optIdx: number
  } | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  // 创建问题元素的refs
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])

  // 初始化时检查已回答的题目，自动切换到最后回答的组别
  useEffect(() => {
    // 确保 answers 存在且不为空
    if (answers && answers.length > 0) {
      // 找到最后一个有答案的组别
      const lastAnsweredGroup = answers.reduce(
        (lastGroup, groupAnswers, currentGroup) => {
          const hasAnswers = groupAnswers.some((answer) => answer !== null)
          return hasAnswers ? currentGroup : lastGroup
        },
        0
      )

      // 如果找到的组别不是第一组，则切换过去
      if (lastAnsweredGroup > 0) {
        setGroupIdx(lastAnsweredGroup)
      } else {
      }
    }
  }, [answers])

  // 当组别改变时，滚动到第一个问题
  useEffect(() => {
    if (questionRefs.current[0]) {
      questionRefs.current[0].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [groupIdx])

  // 当前组所有题目是否已作答
  const currentGroupAllAnswered = answers[groupIdx].every((a) => a !== null)

  // 计算总体完成度
  const totalQuestions = dimensions.reduce(
    (sum, d) => sum + d.questions.length,
    0
  )
  const answeredCount = answers.flat().filter((a) => a !== null).length
  const progress = Math.round((answeredCount / totalQuestions) * 100)

  const handleSelect = (qIdx: number, optIdx: number) => {
    const newAnswers = answers.map((arr) => [...arr])
    newAnswers[groupIdx][qIdx] = optIdx
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

    // 直接生成所有答案
    const newAnswers = dimensions.map((dim) =>
      dim.questions.map(() => Math.floor(Math.random() * 5))
    )
    setAnswers(newAnswers)

    // 显示计算动画并延迟跳转
    setIsCalculating(true)
    setTimeout(() => {
      router.push('/assessment/result')
    }, 2500)
  }

  const handleComplete = () => {
    setIsCalculating(true)
    setTimeout(() => {
      router.push('/assessment/result')
    }, 2500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      {isCalculating && <CalculatingAnimation />}
      <div className="w-full max-w-3xl rounded-2xl shadow-xl p-0 flex flex-col items-center gap-0 bg-white border border-gray-200">
        {/* sticky 标题和进度条 */}
        <div className="sticky top-0 z-20 w-full bg-white rounded-t-2xl shadow-sm">
          <div className="px-6 sm:px-12 pt-8 pb-4 flex flex-col items-center bg-gradient-to-r from-green-50 via-blue-50 to-purple-50">
            {/* 模拟评估按钮 - 仅在开发模式显示 */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={simulateAssessment}
                disabled={isSimulating}
                className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all
                  ${
                    isSimulating
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
              >
                {isSimulating ? '模拟中...' : '模拟评估'}
              </button>
            )}
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {dimensions[groupIdx].name}
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              {dimensions[groupIdx].description}
            </p>

            <ProgressBar
              progress={progress}
              currentGroup={groupIdx}
              totalGroups={dimensions.length}
            />
          </div>
        </div>

        {/* 当前组所有题目 */}
        <div className="w-full flex flex-col gap-12 px-6 sm:px-12 py-8">
          {dimensions[groupIdx].questions.map((q, qIdx) => (
            <Question
              key={qIdx}
              question={q}
              qIdx={qIdx}
              isAnswered={answers[groupIdx][qIdx] !== null}
              selectedOption={answers[groupIdx][qIdx]}
              hovered={hovered}
              onSelect={handleSelect}
              onHover={(qIdx, optIdx) =>
                setHovered(optIdx !== null ? { qIdx, optIdx } : null)
              }
              ref={(el) => {
                questionRefs.current[qIdx] = el
              }}
            />
          ))}
        </div>

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
  )
}
