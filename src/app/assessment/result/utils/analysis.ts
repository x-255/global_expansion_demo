import { dimensions, optionScores } from '../../assessmentModel'

export type AnalysisResult = {
  summary: string;
  details: string;
  suggestions: string[];
}

// 生成具体建议
export const generateSuggestions = (answers: (number | null)[][], scores: number[]): string[] => {
  const suggestions: Set<string> = new Set()
  const threshold = 3 // 得分低于3分（5分制）的题目被认为需要改进

  // 遍历每个维度
  dimensions.forEach((dimension, dimIndex) => {
    const dimensionScore = scores[dimIndex]
    // 只关注得分较低的维度
    if (dimensionScore < 60) { // 60分以下的维度被认为需要改进
      dimension.questions.forEach((question, qIndex) => {
        const answer = answers[dimIndex][qIndex]
        if (answer !== null && optionScores[answer] < threshold) {
          // 根据问题内容生成具体建议
          switch (dimension.name) {
            case '市场调研能力':
              if (question.text.includes('市场调研')) {
                suggestions.add('加强市场调研工作，定期收集分析目标市场数据')
              } else if (question.text.includes('竞争对手')) {
                suggestions.add('深入分析竞争对手情况，制定差异化策略')
              } else if (question.text.includes('客户')) {
                suggestions.add('建立客户需求收集和分析体系')
              }
              break
            case '产品本地化能力':
              if (question.text.includes('定制')) {
                suggestions.add('提升产品定制化能力，满足不同市场需求')
              } else if (question.text.includes('语言')) {
                suggestions.add('完善多语言支持系统')
              } else if (question.text.includes('用户')) {
                suggestions.add('优化产品功能和界面的本地化设计')
              }
              break
            case '跨文化沟通能力':
              if (question.text.includes('文化')) {
                suggestions.add('加强团队的跨文化认知和理解')
              } else if (question.text.includes('语言')) {
                suggestions.add('提升团队的跨语言沟通能力')
              } else if (question.text.includes('培训')) {
                suggestions.add('开展系统的跨文化培训')
              }
              break
            case '法律合规能力':
              if (question.text.includes('法律')) {
                suggestions.add('加强国际法律合规体系建设')
              } else if (question.text.includes('知识产权')) {
                suggestions.add('完善知识产权保护策略')
              } else if (question.text.includes('标准')) {
                suggestions.add('确保符合国际标准和认证要求')
              }
              break
            case '供应链管理能力':
              if (question.text.includes('物流')) {
                suggestions.add('优化国际物流网络效率')
              } else if (question.text.includes('风险')) {
                suggestions.add('加强供应链风险管理')
              } else if (question.text.includes('库存')) {
                suggestions.add('改进库存管理系统')
              }
              break
            case '财务管理能力':
              if (question.text.includes('资金')) {
                suggestions.add('加强国际资金管理能力')
              } else if (question.text.includes('风险')) {
                suggestions.add('完善财务风险控制体系')
              } else if (question.text.includes('预算')) {
                suggestions.add('建立全球化预算管理体系')
              }
              break
            case '风险管理能力':
              if (question.text.includes('评估')) {
                suggestions.add('完善风险评估体系')
              } else if (question.text.includes('危机')) {
                suggestions.add('加强危机管理能力')
              } else if (question.text.includes('保险')) {
                suggestions.add('优化风险保障方案')
              }
              break
          }
        }
      })
    }
  })

  // 如果没有具体建议，添加一些通用建议
  if (suggestions.size === 0) {
    suggestions.add('持续优化全球化战略')
    suggestions.add('保持团队的国际化能力建设')
  }

  return Array.from(suggestions)
}

// 生成分析建议
export const generateAnalysis = (scores: number[], answers: (number | null)[][]): AnalysisResult => {
  // 找出得分最低的维度
  const minScore = Math.min(...scores)
  const weakDimensions = dimensions.filter((_, idx) => scores[idx] === minScore)
  
  // 找出得分最高的维度
  const maxScore = Math.max(...scores)
  const strongDimensions = dimensions.filter((_, idx) => scores[idx] === maxScore)
  
  // 计算平均分
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length

  // 生成维度分析
  const dimensionAnalysis = dimensions.map((dim, idx) => {
    const score = scores[idx]
    if (score === maxScore) {
      return `${dim.name}（${score}分）是您最具优势的领域`
    } else if (score === minScore) {
      return `${dim.name}（${score}分）还需要重点提升`
    }
    return null
  }).filter(Boolean)

  let summary = ''
  let details = ''

  if (avgScore >= 80) {
    summary = `您的全球化准备度评估结果表现优秀，总体准备工作已经相当完善。`
    details = `
您在${strongDimensions.map(d => d.name).join('、')}等方面表现突出，这为企业的全球化发展奠定了良好基础。
${dimensionAnalysis.join('；')}。
虽然整体表现优秀，但在${weakDimensions.map(d => d.name).join('、')}等方面仍有提升空间。`
  } else if (avgScore >= 60) {
    summary = `您的全球化准备度评估结果表现良好，但部分领域仍需加强。`
    details = `
您在${strongDimensions.map(d => d.name).join('、')}等方面具有一定优势。
${dimensionAnalysis.join('；')}。
建议重点关注${weakDimensions.map(d => d.name).join('、')}等维度的提升工作。`
  } else {
    summary = `您的全球化准备度评估显示当前还需要进一步的准备工作。`
    details = `
目前在${strongDimensions.map(d => d.name).join('、')}等方面已经有了一定基础。
${dimensionAnalysis.join('；')}。
在开展全球化业务之前，建议先着重提升${weakDimensions.map(d => d.name).join('、')}等方面的能力。`
  }

  // 生成具体的改进建议
  const suggestions = generateSuggestions(answers, scores)

  return { summary, details, suggestions }
} 