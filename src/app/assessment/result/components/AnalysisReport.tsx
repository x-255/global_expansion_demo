interface Props {
  analysis: string
}

export function AnalysisReport({ analysis }: Props) {
  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">分析报告</h2>
      <div className="text-gray-700 whitespace-pre-line">
        {analysis}
      </div>
    </div>
  )
} 