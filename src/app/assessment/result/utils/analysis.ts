import type { Dimension } from '@/generated/prisma/client'

interface DimensionScore {
  dimensionId: number
  score: number
}

export type AnalysisResult = {
  summary: string;
  details: string;
  suggestions: string[];
}

// 生成具体建议
export const generateSuggestions = (dimensions: Dimension[], scores: number[]): string[] => {
  const suggestions: Set<string> = new Set()

  // 遍历每个维度
  dimensions.forEach((dimension, dimIndex) => {
    const score = scores[dimIndex]
    // 只关注得分较低的维度（低于60分）
    if (score < 60) {
      switch (dimension.name) {
        case '市场潜力':
          suggestions.add('加强市场调研工作，定期收集分析目标市场数据')
          suggestions.add('深入分析竞争对手情况，制定差异化策略')
          break
        case '运营能力':
          suggestions.add('完善供应链管理体系')
          suggestions.add('加强人才储备和培养')
          break
        case '本地化能力':
          suggestions.add('深入了解目标市场的文化和消费习惯')
          suggestions.add('加强与本地合作伙伴的合作')
          break
        case '创新能力':
          suggestions.add('增加研发投入，提升技术创新能力')
          suggestions.add('建立有效的创新管理机制')
          break
        case '品牌实力':
          suggestions.add('制定清晰的品牌定位和传播策略')
          suggestions.add('加强品牌保护和管理')
          break
      }
    }
  })

  return Array.from(suggestions)
}

// 生成分析建议
export function generateAnalysis(dimensionScores: DimensionScore[], dimensions: Dimension[]) {
  // 计算平均分
  const averageScore = dimensionScores.reduce((sum, score) => sum + score.score, 0) / dimensionScores.length

  // 按分数排序
  const sortedScores = [...dimensionScores].sort((a, b) => b.score - a.score)

  // 找出表现最好和最差的维度
  const strongDimensions = sortedScores.filter(score => score.score > averageScore)
  const weakDimensions = sortedScores.filter(score => score.score < averageScore)

  // 生成分析报告
  let analysis = `根据评估结果，贵公司的全球化准备程度总体评分为 ${averageScore.toFixed(1)} 分。\n\n`

  // 添加优势分析
  if (strongDimensions.length > 0) {
    analysis += '主要优势领域：\n'
    strongDimensions.forEach(dimension => {
      const dimensionInfo = dimensions.find(d => d.id === dimension.dimensionId)
      if (dimensionInfo) {
        analysis += `- ${dimensionInfo.name}（${dimension.score.toFixed(1)}分）：表现优异\n`
      }
    })
    analysis += '\n'
  }

  // 添加需改进领域分析
  if (weakDimensions.length > 0) {
    analysis += '需要改进的领域：\n'
    weakDimensions.forEach(dimension => {
      const dimensionInfo = dimensions.find(d => d.id === dimension.dimensionId)
      if (dimensionInfo) {
        analysis += `- ${dimensionInfo.name}（${dimension.score.toFixed(1)}分）：建议加强\n`
      }
    })
  }

  return analysis
} 