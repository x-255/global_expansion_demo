export interface Question {
  text: string
  weight: number
  explanation: string
}

export interface Dimension {
  name: string
  description: string
  questions: Question[]
  weight: number
  id: string
}

// 选项分值（1-5分）
export const optionScores = [5, 4, 3, 2, 1]

// 评估维度及其权重配置
export const dimensions: Dimension[] = [
  {
    id: 'market_research',
    name: '市场调研能力',
    weight: 0.15, // 15%权重
    description: '对目标市场的深入了解和持续研究能力',
    questions: [
      {
        text: '我们定期对目标海外市场进行深入调研。',
        weight: 0.2,
        explanation: '定期的市场调研是了解市场动态的基础',
      },
      {
        text: '我们了解目标市场的主要竞争对手和行业格局。',
        weight: 0.2,
        explanation: '竞争分析对制定市场策略至关重要',
      },
      {
        text: '我们能够获取并分析海外市场的最新政策和法规信息。',
        weight: 0.2,
        explanation: '政策法规合规是海外经营的前提',
      },
      {
        text: '我们有专门的团队负责海外市场信息收集。',
        weight: 0.15,
        explanation: '专业团队保证信息收集的质量和持续性',
      },
      {
        text: '我们会根据市场调研结果调整出海策略。',
        weight: 0.15,
        explanation: '及时根据市场反馈调整策略的能力',
      },
      {
        text: '我们能够识别目标市场的潜在客户群体。',
        weight: 0.1,
        explanation: '准确的目标客户定位',
      },
    ],
  },
  {
    id: 'product_localization',
    name: '产品本地化能力',
    weight: 0.15, // 15%权重
    description: '根据目标市场需求调整产品的能力',
    questions: [
      {
        text: '我们的产品能够根据不同市场需求进行定制。',
        weight: 0.2,
        explanation: '产品定制化能力',
      },
      {
        text: '我们有能力为不同国家/地区提供本地化语言支持。',
        weight: 0.2,
        explanation: '多语言支持能力',
      },
      {
        text: '我们会根据当地用户习惯调整产品功能或界面。',
        weight: 0.2,
        explanation: '用户体验本地化能力',
      },
      {
        text: '我们能够快速响应海外用户的反馈并进行产品优化。',
        weight: 0.15,
        explanation: '产品迭代响应速度',
      },
      {
        text: '我们会针对不同市场进行产品包装和说明书的本地化。',
        weight: 0.15,
        explanation: '产品包装本地化',
      },
      {
        text: '我们有专门的本地化测试流程。',
        weight: 0.1,
        explanation: '本地化质量保证',
      },
    ],
  },
  {
    id: 'cross_culture',
    name: '跨文化沟通能力',
    weight: 0.12, // 12%权重
    description: '理解并适应不同文化背景的能力',
    questions: [
      {
        text: '我们的团队了解目标市场的文化习俗和禁忌。',
        weight: 0.25,
        explanation: '文化认知基础',
      },
      {
        text: '我们有能力用当地语言进行商务沟通。',
        weight: 0.2,
        explanation: '语言沟通能力',
      },
      {
        text: '我们能够根据不同文化背景调整沟通方式。',
        weight: 0.2,
        explanation: '沟通方式的文化适应性',
      },
      {
        text: '我们的营销内容会考虑当地文化元素。',
        weight: 0.2,
        explanation: '营销文化适配性',
      },
      {
        text: '我们定期对团队进行跨文化培训。',
        weight: 0.15,
        explanation: '团队文化能力建设',
      },
    ],
  },
  {
    id: 'legal_compliance',
    name: '法律合规能力',
    weight: 0.13, // 13%权重
    description: '遵守国际和当地法律法规的能力',
    questions: [
      {
        text: '我们了解并遵守目标市场的相关法律法规。',
        weight: 0.25,
        explanation: '基本法律合规意识',
      },
      {
        text: '我们有专业的法律顾问支持海外业务。',
        weight: 0.2,
        explanation: '专业法律支持',
      },
      {
        text: '我们的产品符合目标市场的质量和安全标准。',
        weight: 0.2,
        explanation: '产品合规性',
      },
      {
        text: '我们有完善的知识产权保护策略。',
        weight: 0.2,
        explanation: '知识产权管理',
      },
      {
        text: '我们定期更新合规要求并进行内部审计。',
        weight: 0.15,
        explanation: '合规管理的持续性',
      },
    ],
  },
  {
    id: 'supply_chain',
    name: '供应链管理能力',
    weight: 0.12, // 12%权重
    description: '管理国际供应链的能力',
    questions: [
      {
        text: '我们有稳定的国际物流合作伙伴。',
        weight: 0.25,
        explanation: '物流保障能力',
      },
      {
        text: '我们能够有效管理跨境供应链风险。',
        weight: 0.2,
        explanation: '风险管理能力',
      },
      {
        text: '我们有应对供应链中断的备选方案。',
        weight: 0.2,
        explanation: '供应链韧性',
      },
      {
        text: '我们能够保证海外订单的及时交付。',
        weight: 0.2,
        explanation: '交付能力',
      },
      {
        text: '我们有效的库存管理系统。',
        weight: 0.15,
        explanation: '库存管理能力',
      },
    ],
  },
  {
    id: 'financial_capability',
    name: '财务管理能力',
    weight: 0.12, // 12%权重
    description: '管理国际业务财务的能力',
    questions: [
      {
        text: '我们有专门的国际业务财务团队。',
        weight: 0.25,
        explanation: '专业财务管理能力',
      },
      {
        text: '我们能够有效管理汇率风险。',
        weight: 0.2,
        explanation: '汇率风险管理',
      },
      {
        text: '我们了解目标市场的税收政策。',
        weight: 0.2,
        explanation: '税务管理能力',
      },
      {
        text: '我们有清晰的海外业务预算管理制度。',
        weight: 0.2,
        explanation: '预算管理能力',
      },
      {
        text: '我们能够进行跨境资金管理。',
        weight: 0.15,
        explanation: '资金管理能力',
      },
    ],
  },
  {
    id: 'risk_management',
    name: '风险管理能力',
    weight: 0.08, // 8%权重
    description: '识别和管理国际业务风险的能力',
    questions: [
      {
        text: '我们有系统的风险评估流程。',
        weight: 0.25,
        explanation: '风险评估能力',
      },
      {
        text: '我们有完善的危机处理预案。',
        weight: 0.25,
        explanation: '危机管理能力',
      },
      {
        text: '我们定期进行风险审查和更新。',
        weight: 0.2,
        explanation: '风险监控能力',
      },
      {
        text: '我们有适当的保险覆盖。',
        weight: 0.15,
        explanation: '风险转移能力',
      },
      {
        text: '我们有效的内部控制系统。',
        weight: 0.15,
        explanation: '内控管理能力',
      },
    ],
  },
  {
    id: 'digital_capability',
    name: '数字化能力',
    weight: 0.08, // 8%权重
    description: '利用数字技术支持国际业务的能力',
    questions: [
      {
        text: '我们有完善的跨境电商平台。',
        weight: 0.25,
        explanation: '电商运营能力',
      },
      {
        text: '我们能够收集和分析海外市场数据。',
        weight: 0.2,
        explanation: '数据分析能力',
      },
      {
        text: '我们有数字化的客户服务系统。',
        weight: 0.2,
        explanation: '客服系统能力',
      },
      {
        text: '我们使用数字工具进行团队协作。',
        weight: 0.2,
        explanation: '协作工具应用',
      },
      {
        text: '我们有网络安全保护措施。',
        weight: 0.15,
        explanation: '网络安全能力',
      },
    ],
  },
  {
    id: 'talent_management',
    name: '人才管理能力',
    weight: 0.05, // 5%权重
    description: '管理国际化人才的能力',
    questions: [
      {
        text: '我们有吸引和保留国际化人才的机制。',
        weight: 0.25,
        explanation: '人才吸引力',
      },
      {
        text: '我们提供国际化培训和发展机会。',
        weight: 0.25,
        explanation: '人才发展能力',
      },
      {
        text: '我们有效的跨文化团队管理机制。',
        weight: 0.2,
        explanation: '团队管理能力',
      },
      {
        text: '我们有竞争力的国际化人才薪酬体系。',
        weight: 0.15,
        explanation: '薪酬竞争力',
      },
      {
        text: '我们重视本地化人才的培养。',
        weight: 0.15,
        explanation: '本地人才发展',
      },
    ],
  },
]

// 计算单个维度的得分
export const calculateDimensionScore = (
  dimensionId: string,
  answers: number[]
): { score: number; maxScore: number } => {
  const dimension = dimensions.find((d) => d.id === dimensionId)
  if (!dimension) return { score: 0, maxScore: 0 }

  let totalScore = 0
  let totalMaxScore = 0

  dimension.questions.forEach((question, index) => {
    if (answers[index] !== null && answers[index] !== undefined) {
      const score = optionScores[answers[index]]
      totalScore += score * question.weight
      totalMaxScore += 5 * question.weight // 5是单题最高分
    }
  })

  return {
    score: totalScore,
    maxScore: totalMaxScore,
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
      totalScore +=
        (dimensionScore.score / dimensionScore.maxScore) *
        dimension.weight *
        100
      totalMaxScore += dimension.weight * 100
    }
  })

  return {
    score: totalScore,
    maxScore: totalMaxScore,
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
