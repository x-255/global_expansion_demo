'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAssessmentStore } from '../../store/assessment'
import { getDimensions } from '../actions'
import { getDimensionsAverageScores } from './actions'
import { RadarChart } from './components/RadarChart'
import { AnalysisReport } from './components/AnalysisReport'
import type {
  Dimension,
  Question,
  QuestionOption,
} from '@/generated/prisma/client'

// 计算单个维度的得分
function calculateDimensionScore(
  questions: Question[],
  dimensionAnswers: Array<{ questionId: number; answer: number | null }>,
  allOptions: QuestionOption[]
) {
  if (
    questions.length === 0 ||
    !dimensionAnswers ||
    dimensionAnswers.length === 0
  )
    return 0

  let totalScore = 0
  let validAnswers = 0

  questions.forEach((question) => {
    const answer = dimensionAnswers.find(
      (a) => a.questionId === question.id
    )?.answer
    if (answer !== null && answer !== undefined) {
      const option = allOptions.find((opt) => opt.id === answer)
      if (option) {
        totalScore += option.score
        validAnswers++
      }
    }
  })

  return validAnswers === 0 ? 0 : Number((totalScore / validAnswers).toFixed(2))
}

export default function ResultPage() {
  const router = useRouter()
  const { answers, clearAnswers, hydrated } = useAssessmentStore()
  const [dimensions, setDimensions] = useState<Dimension[]>([])
  const [dimensionScores, setDimensionScores] = useState<
    Array<{
      id: number
      name: string
      score: number
      weight: number
      averageScore: number
    }>
  >([])
  const [totalScore, setTotalScore] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // 如果store还没有hydrated，不执行任何操作
    if (!hydrated) return

    const loadData = async () => {
      try {
        // 如果没有答案，返回评估页面
        if (!answers || answers.every((a) => a.answer === null)) {
          router.push('/assessment')
          return
        }

        // 加载维度数据和平均分
        const [dimensionsData, averageScores] = await Promise.all([
          getDimensions(),
          getDimensionsAverageScores(),
        ])

        setDimensions(dimensionsData)

        // 获取所有选项数据用于计算分数
        const allOptions = dimensionsData.flatMap((d) =>
          d.questions.flatMap((q) => q.options)
        )

        // 计算每个维度的得分并合并平均分
        const scores = dimensionsData.map((dim) => {
          const score = calculateDimensionScore(
            dim.questions,
            answers.filter((a) =>
              dim.questions.some((q) => q.id === a.questionId)
            ),
            allOptions
          )

          const averageScore =
            averageScores.find((avg) => avg.dimensionId === dim.id)
              ?.averageScore || 0

          return {
            id: dim.id,
            name: dim.name,
            score: Number(score.toFixed(2)),
            weight: dim.weight,
            averageScore: Number(averageScore.toFixed(2)),
          }
        })

        const totalWeight = scores.reduce((sum, item) => sum + item.weight, 0)
        const total = Number(
          (
            scores.reduce((sum, item) => sum + item.score * item.weight, 0) /
            totalWeight
          ).toFixed(2)
        )

        setDimensionScores(scores)
        setTotalScore(total)
        setLoading(false)
      } catch (error) {
        console.error('加载评估结果失败:', error)
        setErrorMessage('加载评估结果失败，请稍后重试')
        setLoading(false)
      }
    }

    loadData()
  }, [answers, router, hydrated])

  const handleRestart = () => {
    clearAnswers()
    router.push('/assessment')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{errorMessage}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="w-full max-w-4xl bg-gray-2 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">
          评估结果
        </h1>

        <div className="text-center mb-12">
          <div className="text-6xl font-bold text-gold mb-2">{totalScore}</div>
          <div className="text-gray-3">总分（满分5分）</div>
        </div>
        <RadarChart
          scores={dimensionScores.map((d) => d.score)}
          dimensions={dimensions}
        />
        <AnalysisReport dimensions={dimensionScores} totalScore={totalScore} />

        {/* 返回按钮 */}
        <div className="mt-12 text-center">
          <button
            onClick={handleRestart}
            className="px-8 py-3 bg-primary text-white rounded-full text-lg font-semibold shadow-lg hover:bg-gold transition-all"
          >
            重新评估
          </button>
        </div>
      </div>
    </div>
  )
}
