'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAssessmentStore } from '../../store/assessment'
import { getDimensions } from '../actions'
import { RadarChart } from './components/RadarChart'
import { AnalysisReport } from './components/AnalysisReport'
import { generateAnalysis } from './utils/analysis'
import type { Dimension, Question } from '@/generated/prisma/client'

// 计算单个维度的得分
function calculateDimensionScore(questions: Question[], answers: (number | null)[]) {
  if (questions.length === 0 || !answers || answers.length === 0) return 0

  let totalScore = 0
  let validAnswers = 0

  answers.forEach(answer => {
    if (answer !== null) {
      // 将0-4的选项转换为0-100的分数
      totalScore += (answer / 4) * 100
      validAnswers++
    }
  })

  return validAnswers === 0 ? 0 : Math.round(totalScore / validAnswers)
}

function calculateTotalScore(dimensions: Dimension[], dimensionScores: number[]) {
  if (dimensions.length === 0) return 0
  return Math.round(dimensionScores.reduce((sum, score) => sum + score, 0) / dimensions.length)
}

export default function ResultPage() {
  const router = useRouter()
  const { answers, clearAnswers } = useAssessmentStore()
  const [dimensions, setDimensions] = useState<Dimension[]>([])
  const [scores, setScores] = useState<number[]>([])
  const [totalScore, setTotalScore] = useState<number>(0)
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        // 如果没有答案，返回评估页面
        if (!answers || answers.flat().every((a) => a === null)) {
          router.push('/assessment')
          return
        }

        // 加载维度数据
        const dimensionsData = await getDimensions()
        setDimensions(dimensionsData)

        // 计算每个维度的得分
        const dimensionScores = dimensionsData.map((dim, idx) => ({
          dimensionId: dim.id,
          score: calculateDimensionScore(dim.questions, answers[idx])
        }))

        const scores = dimensionScores.map(ds => ds.score)
        const total = calculateTotalScore(dimensionsData, scores)

        setScores(scores)
        setTotalScore(total)
        setAnalysis(generateAnalysis(dimensionScores, dimensionsData))
        setLoading(false)
      } catch {
        setError('加载评估结果失败，请稍后重试')
        setLoading(false)
      }
    }

    loadData()
  }, [answers, router])

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">评估结果</h1>

        <div className="text-center mb-12">
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {totalScore}
          </div>
          <div className="text-gray-600">总分（满分100）</div>
        </div>
        <RadarChart scores={scores} dimensions={dimensions} />
        <AnalysisReport analysis={analysis} />

        {/* 返回按钮 */}
        <div className="mt-12 text-center">
          <button
            onClick={handleRestart}
            className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all"
          >
            重新评估
          </button>
        </div>
      </div>
    </div>
  )
}
