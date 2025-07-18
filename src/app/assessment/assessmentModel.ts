export interface Dimension {
  id: number
  name: string
  description: string
  questions: Question[]
  weight: number
}

export interface Question {
  id: number
  text: string
  explanation: string
  weight: number
}

export const optionScores = [0, 25, 50, 75, 100] // 5-point Likert scale scores

export const dimensions: Dimension[] = [
  {
    id: 1,
    name: '市场潜力',
    description: '评估目标市场的规模、增长潜力和竞争格局',
    weight: 20,
    questions: [
      {
        id: 1,
        text: '目标市场的规模和增长率如何？',
        explanation: '考虑市场的当前规模和预期年增长率',
        weight: 20,
      },
      {
        id: 2,
        text: '市场竞争格局如何？',
        explanation: '评估主要竞争对手的数量和市场份额',
        weight: 20,
      },
      {
        id: 3,
        text: '是否存在明显的市场进入壁垒？',
        explanation: '考虑监管、技术、资金等方面的进入壁垒',
        weight: 20,
      },
      {
        id: 4,
        text: '目标市场的消费能力如何？',
        explanation: '评估目标客户的支付意愿和能力',
        weight: 20,
      },
      {
        id: 5,
        text: '市场是否具有可持续性？',
        explanation: '考虑长期的市场需求和发展趋势',
        weight: 20,
      },
    ],
  },
  {
    id: 2,
    name: '运营能力',
    description: '评估公司的运营效率和管理能力',
    weight: 20,
    questions: [
      {
        id: 6,
        text: '是否建立了完善的供应链体系？',
        explanation: '评估供应商管理、库存控制等方面',
        weight: 20,
      },
      {
        id: 7,
        text: '是否具备足够的人力资源？',
        explanation: '考虑人才储备和招聘能力',
        weight: 20,
      },
      {
        id: 8,
        text: '是否有效的质量控制体系？',
        explanation: '评估产品/服务质量管理能力',
        weight: 20,
      },
      {
        id: 9,
        text: '是否具备规范的财务管理？',
        explanation: '考虑财务规划和控制能力',
        weight: 20,
      },
      {
        id: 10,
        text: '是否有清晰的风险管理流程？',
        explanation: '评估风险识别和应对能力',
        weight: 20,
      },
    ],
  },
  {
    id: 3,
    name: '本地化能力',
    description: '评估公司适应目标市场的能力',
    weight: 20,
    questions: [
      {
        id: 11,
        text: '是否了解当地文化和消费习惯？',
        explanation: '评估对目标市场文化的理解程度',
        weight: 20,
      },
      {
        id: 12,
        text: '是否具备本地化的营销能力？',
        explanation: '考虑营销策略的本地化程度',
        weight: 20,
      },
      {
        id: 13,
        text: '是否建立了本地合作伙伴关系？',
        explanation: '评估与当地合作伙伴的合作情况',
        weight: 20,
      },
      {
        id: 14,
        text: '是否了解当地法律法规？',
        explanation: '考虑对当地法律环境的了解程度',
        weight: 20,
      },
      {
        id: 15,
        text: '是否具备本地化的客户服务能力？',
        explanation: '评估提供本地化服务的能力',
        weight: 20,
      },
    ],
  },
  {
    id: 4,
    name: '创新能力',
    description: '评估公司的产品创新和技术实力',
    weight: 20,
    questions: [
      {
        id: 16,
        text: '是否有持续的研发投入？',
        explanation: '评估研发资金和人力投入情况',
        weight: 20,
      },
      {
        id: 17,
        text: '是否具备核心技术优势？',
        explanation: '考虑技术创新能力和专利储备',
        weight: 20,
      },
      {
        id: 18,
        text: '是否有效的创新管理机制？',
        explanation: '评估创新项目管理能力',
        weight: 20,
      },
      {
        id: 19,
        text: '是否具备快速响应市场的能力？',
        explanation: '考虑产品快速迭代能力',
        weight: 20,
      },
      {
        id: 20,
        text: '是否建立了创新激励机制？',
        explanation: '评估员工创新积极性',
        weight: 20,
      },
    ],
  },
  {
    id: 5,
    name: '品牌实力',
    description: '评估公司的品牌影响力和市场认知度',
    weight: 20,
    questions: [
      {
        id: 21,
        text: '品牌在目标市场的认知度如何？',
        explanation: '评估品牌知名度和美誉度',
        weight: 20,
      },
      {
        id: 22,
        text: '是否有清晰的品牌定位？',
        explanation: '考虑品牌差异化策略',
        weight: 20,
      },
      {
        id: 23,
        text: '是否有效的品牌传播策略？',
        explanation: '评估品牌营销效果',
        weight: 20,
      },
      {
        id: 24,
        text: '是否建立了品牌保护机制？',
        explanation: '考虑知识产权保护措施',
        weight: 20,
      },
      {
        id: 25,
        text: '品牌价值是否持续提升？',
        explanation: '评估品牌价值增长情况',
        weight: 20,
      },
    ],
  },
]

// 计算单个维度的得分
export const calculateDimensionScore = (
  dimensionId: string,
  answers: number[]
): { score: number; maxScore: number } => {
  const dimension = dimensions.find((d) => d.id === +dimensionId)
  if (!dimension) return { score: 0, maxScore: 0 }

  let totalScore = 0
  let totalMaxScore = 0

  dimension.questions.forEach((question, index) => {
    if (answers[index] !== null && answers[index] !== undefined) {
      const score = optionScores[answers[index]]
      totalScore += score * (question.weight / 100) // 将权重转换为百分比
      totalMaxScore += 100 * (question.weight / 100) // 100是单题最高分
    }
  })

  return {
    score: Number(totalScore.toFixed(2)),
    maxScore: Number(totalMaxScore.toFixed(2)),
  }
}

// 计算总分
export const calculateTotalScore = (dimensionScores: {
  [key: string]: { score: number; maxScore: number }
}): { score: number; maxScore: number } => {
  let totalScore = 0
  let totalMaxScore = 0

  dimensions.forEach((dimension) => {
    const dimensionScore = dimensionScores[dimension.id]
    if (dimensionScore) {
      totalScore += Number(
        (
          (dimensionScore.score / dimensionScore.maxScore) *
          dimension.weight
        ).toFixed(2)
      ) // 直接使用0-100的权重
      totalMaxScore += dimension.weight
    }
  })

  return {
    score: Number(totalScore.toFixed(2)),
    maxScore: Number(totalMaxScore.toFixed(2)),
  }
}

// 获取得分等级
export const getScoreLevel = (
  score: number
): {
  level: string
  description: string
  color: string
} => {
  if (score >= 90) {
    return {
      level: '领先',
      description: '出海能力非常强，具备持续领先的竞争优势',
      color: 'text-green-600',
    }
  } else if (score >= 80) {
    return {
      level: '优秀',
      description: '出海能力突出，具备明显的竞争优势',
      color: 'text-blue-600',
    }
  } else if (score >= 70) {
    return {
      level: '良好',
      description: '出海能力良好，具备基本的竞争力',
      color: 'text-cyan-600',
    }
  } else if (score >= 60) {
    return {
      level: '达标',
      description: '出海能力达到基本要求，仍有提升空间',
      color: 'text-yellow-600',
    }
  } else {
    return {
      level: '需改进',
      description: '出海能力有待提升，建议重点改进',
      color: 'text-red-600',
    }
  }
}
