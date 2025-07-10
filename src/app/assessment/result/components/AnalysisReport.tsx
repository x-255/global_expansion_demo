type AnalysisResult = {
  summary: string;
  details: string;
  suggestions: string[];
}

export const AnalysisReport = ({ analysis }: { analysis: AnalysisResult }) => (
  <div className="mb-12 p-6 bg-gray-50 rounded-xl">
    <h2 className="text-xl font-semibold mb-6">分析报告</h2>
    
    {/* 总体评价 */}
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3 text-blue-600">总体评价</h3>
      <p className="text-gray-700">{analysis.summary}</p>
    </div>

    {/* 详细分析 */}
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3 text-blue-600">详细分析</h3>
      <p className="text-gray-700 whitespace-pre-line">{analysis.details}</p>
    </div>

    {/* 改进建议 */}
    <div>
      <h3 className="text-lg font-medium mb-3 text-blue-600">改进建议</h3>
      <ul className="list-disc list-inside space-y-2">
        {analysis.suggestions.map((suggestion, index) => (
          <li key={index} className="text-gray-700">{suggestion}</li>
        ))}
      </ul>
    </div>
  </div>
) 