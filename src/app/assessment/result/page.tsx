'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { dimensions, optionScores, type Question } from '../assessmentModel'
import { useAssessmentStore } from '../../store/assessment'
import { RadarChart } from './components/RadarChart'
import { AnalysisReport } from './components/AnalysisReport'
import { generateAnalysis, type AnalysisResult } from './utils/analysis'

// 计算单个维度的得分
const calculateDimensionScore = (
  answers: (number | null)[],
  questions: Question[]
) => {
  let totalScore = 0
  let totalWeight = 0

  questions.forEach((q, idx) => {
    if (answers[idx] !== null) {
      // 将5分制转换为100分制：(5分制分数 / 5) * 100
      const score100 = (optionScores[answers[idx]] / 5) * 100
      totalScore += score100 * q.weight
      totalWeight += q.weight
    }
  })

  return totalWeight > 0 ? Math.round(totalScore) : 0
}

export default function ResultPage() {
  const router = useRouter()
  const { answers, clearAnswers } = useAssessmentStore()
  const [scores, setScores] = useState<number[]>([])
  const [totalScore, setTotalScore] = useState<number>(0)
  const [analysis, setAnalysis] = useState<AnalysisResult>({
    summary: '',
    details: '',
    suggestions: [],
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!answers || answers.flat().every((a) => a === null)) {
        router.push('/assessment')
        return
      }

      const dimensionScores = dimensions.map((dim, idx) =>
        calculateDimensionScore(answers[idx], dim.questions)
      )

      const total = Math.round(
        dimensions.reduce(
          (sum, dim, idx) => sum + dimensionScores[idx] * dim.weight,
          0
        )
      )

      setScores(dimensionScores)
      setTotalScore(total)
      setAnalysis(generateAnalysis(dimensionScores, answers))
    }, 0)

    return () => clearTimeout(timer)
  }, [answers, router])

  const handleRestart = () => {
    clearAnswers()
    router.push('/assessment')
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
        <RadarChart scores={scores} />
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
