import { PrismaClient } from '../src/generated/prisma'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

// 在文件开头添加类型定义
interface QuestionOption {
  score: number
  description: string
}

interface Question {
  text: string
  options: QuestionOption[]
}

async function main() {
  // 清理现有数据
  await prisma.questionOption.deleteMany()
  await prisma.question.deleteMany()
  await prisma.strategyAction.deleteMany()
  await prisma.dimensionStrategy.deleteMany()
  await prisma.coreStrategyAction.deleteMany()
  await prisma.coreStrategy.deleteMany()
  await prisma.maturityLevel.deleteMany()
  await prisma.dimension.deleteMany()
  await prisma.admin.deleteMany()

  // 创建初始管理员
  const hashedPassword = await hash('123123', 10)
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: '系统管理员',
    },
  })

  // 创建成熟度等级
  const maturityLevels = await Promise.all([
    prisma.maturityLevel.create({
      data: {
        level: 1,
        name: 'L1（初始级）',
        description: '未建立相关能力或完全依赖外部支持',
        coreFeatures:
          '缺乏战略规划、市场洞察、资源协同等核心能力，国际化实践零散且无体系',
        minScore: 1.0,
        maxScore: 1.99,
        icon: '🌱',
      },
    }),
    prisma.maturityLevel.create({
      data: {
        level: 2,
        name: 'L2（基础级）',
        description: '有初步实践但未形成体系',
        coreFeatures:
          '有局部能力（如单一市场调研或简单本地化），但缺乏动态优化和资源整合',
        minScore: 2.0,
        maxScore: 2.99,
        icon: '🏗️',
      },
    }),
    prisma.maturityLevel.create({
      data: {
        level: 3,
        name: 'L3（稳健级）',
        description: '体系化但缺乏优化',
        coreFeatures:
          '拥有完整框架（如供应链管理或品牌传播），但效率、创新性或抗风险能力不足',
        minScore: 3.0,
        maxScore: 3.99,
        icon: '🏢',
      },
    }),
    prisma.maturityLevel.create({
      data: {
        level: 4,
        name: 'L4（优化级）',
        description: '动态调整且效果显著',
        coreFeatures: '能力成熟且可复制，具备行业领先实践，但尚未主导规则制定',
        minScore: 4.0,
        maxScore: 4.99,
        icon: '🚀',
      },
    }),
    prisma.maturityLevel.create({
      data: {
        level: 5,
        name: 'L5（卓越级）',
        description: '行业标杆或规则定义者',
        coreFeatures:
          '通过创新、生态联盟或价值观输出定义行业标准，具备全球影响力',
        minScore: 5.0,
        maxScore: 5.0,
        icon: '🌟',
      },
    }),
  ])

  // 创建维度
  const strategicDimension = await prisma.dimension.create({
    data: {
      name: '战略规划与执行能力',
      description: '评估企业的战略制定、目标管理和资源调配能力',
      coreCapability: '战略制定、目标管理、资源调配',
      weight: 1.0,
      order: 1,
      deleted: false,
      icon: '🎯',
    },
  })

  const marketDimension = await prisma.dimension.create({
    data: {
      name: '市场洞察与本地化能力',
      description: '评估企业对目标市场的理解和适应能力',
      coreCapability: '市场调研、文化适配、政策响应',
      weight: 1.0,
      order: 2,
      deleted: false,
      icon: '🗺️',
    },
  })

  const productDimension = await prisma.dimension.create({
    data: {
      name: '产品与品牌国际化能力',
      description: '评估企业的产品设计、品牌定位和知识产权管理能力',
      coreCapability: '产品设计、品牌定位、知识产权',
      weight: 1.0,
      order: 3,
      deleted: false,
      icon: '🌍',
    },
  })

  const supplyChainDimension = await prisma.dimension.create({
    data: {
      name: '供应链与物流管理能力',
      description: '评估企业的供应商管理、仓储布局和成本控制能力',
      coreCapability: '供应商管理、仓储布局、成本控制',
      weight: 1.0,
      order: 4,
      deleted: false,
      icon: '🚚',
    },
  })

  const riskDimension = await prisma.dimension.create({
    data: {
      name: '风险管理与合规能力',
      description: '评估企业的法律遵循、危机应对和ESG治理能力',
      coreCapability: '法律遵循、危机应对、ESG治理',
      weight: 1.0,
      order: 5,
      deleted: false,
      icon: '🛡️',
    },
  })

  const collaborationDimension = await prisma.dimension.create({
    data: {
      name: '跨国协作与领导力',
      description: '评估企业的跨文化管理、组织协同和人才培养能力',
      coreCapability: '跨文化管理、组织协同、人才培养',
      weight: 1.0,
      order: 6,
      deleted: false,
      icon: '🤝',
    },
  })

  // 创建战略规划维度的问题和选项
  const strategicQuestions = [
    {
      text: '企业是否制定了明确的3-5年出海战略，并与总部整体战略对齐？',
      options: [
        { score: 1, description: '无战略规划' },
        { score: 2, description: '有初步框架但未对齐' },
        { score: 3, description: '有阶段性规划' },
        { score: 4, description: '动态优化战略' },
        { score: 5, description: '战略驱动创新' },
      ],
    },
    {
      text: '是否建立战略执行的KPI体系（如市场渗透率、营收增长率）？',
      options: [
        { score: 1, description: '无KPI' },
        { score: 2, description: '有基础指标' },
        { score: 3, description: '有定期复盘机制' },
        { score: 4, description: '敏捷调整执行计划' },
        { score: 5, description: '战略反哺行业规则' },
      ],
    },
    {
      text: '是否通过"总部+本地"协作模型实现资源支持与灵活执行？',
      options: [
        { score: 1, description: '无协作机制' },
        { score: 2, description: '总部主导决策' },
        { score: 3, description: '本地团队参与执行' },
        { score: 4, description: '跨区域资源整合' },
        { score: 5, description: '生态联盟主导战略' },
      ],
    },
    {
      text: '是否定期复盘战略执行效果并动态优化？',
      options: [
        { score: 1, description: '无复盘机制' },
        { score: 2, description: '偶发性总结' },
        { score: 3, description: '季度复盘' },
        { score: 4, description: '动态调整战略' },
        { score: 5, description: '战略反哺行业规则' },
      ],
    },
    {
      text: '是否将战略目标分解为部门级OKR？',
      options: [
        { score: 1, description: '无目标分解' },
        { score: 2, description: '局部分解' },
        { score: 3, description: '基础对齐' },
        { score: 4, description: '敏捷对齐' },
        { score: 5, description: '战略与业务深度联动' },
      ],
    },
    {
      text: '是否通过并购或合资拓展战略边界？',
      options: [
        { score: 1, description: '无相关动作' },
        { score: 2, description: '尝试性合作' },
        { score: 3, description: '局部资源整合' },
        { score: 4, description: '战略级并购' },
        { score: 5, description: '主导行业生态' },
      ],
    },
  ]

  // 创建市场洞察维度的问题和选项
  const marketQuestions = [
    {
      text: '是否建立目标市场数据库（人口、消费习惯、政策法规）？',
      options: [
        { score: 1, description: '无数据支持' },
        { score: 2, description: '主要依赖直觉判断' },
        { score: 3, description: '有基础调研报告' },
        { score: 4, description: '动态更新市场情报' },
        { score: 5, description: '定义新市场需求' },
      ],
    },
    {
      text: '是否通过消费者焦点小组或NPS调研获取本地化需求？',
      options: [
        { score: 1, description: '无反馈机制' },
        { score: 2, description: '偶发性访谈' },
        { score: 3, description: '定期收集需求' },
        { score: 4, description: '预测市场趋势' },
        { score: 5, description: '文化输出驱动需求' },
      ],
    },
    {
      text: '是否建立本地化团队（如本土顾问、政府关系）？',
      options: [
        { score: 1, description: '无本地团队' },
        { score: 2, description: '依赖外部代理' },
        { score: 3, description: '雇佣少量本地人员' },
        { score: 4, description: '深度嵌入本地生态' },
        { score: 5, description: '主导行业标准' },
      ],
    },
    {
      text: '是否利用大数据分析预测市场趋势？',
      options: [
        { score: 1, description: '无数据分析' },
        { score: 2, description: '局部使用' },
        { score: 3, description: '基础预测模型' },
        { score: 4, description: '实时数据驱动' },
        { score: 5, description: '定义新市场规则' },
      ],
    },
    {
      text: '是否通过节日营销或文化活动融入本地生态？',
      options: [
        { score: 1, description: '无营销活动' },
        { score: 2, description: '依赖传统广告' },
        { score: 3, description: '单一渠道推广' },
        { score: 4, description: '多渠道整合营销' },
        { score: 5, description: '品牌生态主导' },
      ],
    },
    {
      text: '是否与本地协会合作获取政策支持？',
      options: [
        { score: 1, description: '无合作' },
        { score: 2, description: '偶发性接触' },
        { score: 3, description: '基础关系维护' },
        { score: 4, description: '深度政策联动' },
        { score: 5, description: '主导行业标准' },
      ],
    },
  ]

  // 创建产品与品牌国际化维度的问题和选项
  const productQuestions = [
    {
      text: '是否根据目标市场调整产品设计（如语言适配、功能定制）？',
      options: [
        { score: 1, description: '产品直接复制' },
        { score: 2, description: '简单本地化测试' },
        { score: 3, description: '适应性调整' },
        { score: 4, description: '技术驱动差异化' },
        { score: 5, description: '定义行业新规则' },
      ],
    },
    {
      text: '是否明确品牌核心价值主张（如环保、科技感）？',
      options: [
        { score: 1, description: '无品牌定位' },
        { score: 2, description: '模糊的品牌描述' },
        { score: 3, description: '有基础传播策略' },
        { score: 4, description: '与本地文化融合' },
        { score: 5, description: '全球价值观输出' },
      ],
    },
    {
      text: '是否通过KOL合作、节日营销等本地化策略推广品牌？',
      options: [
        { score: 1, description: '无营销活动' },
        { score: 2, description: '依赖传统广告' },
        { score: 3, description: '单一渠道推广' },
        { score: 4, description: '多渠道整合营销' },
        { score: 5, description: '品牌生态主导' },
      ],
    },
    {
      text: '是否构建品牌故事并与本地文化结合？',
      options: [
        { score: 1, description: '无品牌叙事' },
        { score: 2, description: '简单描述' },
        { score: 3, description: '基础文化融合' },
        { score: 4, description: '情感共鸣' },
        { score: 5, description: '全球价值观输出' },
      ],
    },
    {
      text: '是否建立品牌口碑管理体系？',
      options: [
        { score: 1, description: '无反馈机制' },
        { score: 2, description: '偶发性调研' },
        { score: 3, description: '定期收集口碑' },
        { score: 4, description: '数据驱动改进' },
        { score: 5, description: '行业标杆口碑' },
      ],
    },
    {
      text: '是否通过技术或模式创新定义新市场规则？',
      options: [
        { score: 1, description: '无创新' },
        { score: 2, description: '局部改进' },
        { score: 3, description: '适应性创新' },
        { score: 4, description: '技术突破' },
        { score: 5, description: '行业规则制定' },
      ],
    },
  ]

  // 创建供应链维度的问题和选项
  const supplyChainQuestions: Question[] = [
    {
      text: '是否建立国际供应链体系（如多元化采购、本地仓储）？',
      options: [
        { score: 1, description: '依赖单一供应商' },
        { score: 2, description: '初步本地化布局' },
        { score: 3, description: '优化物流路径' },
        { score: 4, description: '数字化供应链' },
        { score: 5, description: '绿色供应链生态' },
      ],
    },
    {
      text: '是否通过ERP或区块链实现供应链可视化？',
      options: [
        { score: 1, description: '无系统支持' },
        { score: 2, description: '局部信息化' },
        { score: 3, description: '基础库存管理' },
        { score: 4, description: '实时数据监控' },
        { score: 5, description: 'AI预测与优化' },
      ],
    },
    {
      text: '是否通过JIT模式降低库存成本并缩短交付周期？',
      options: [
        { score: 1, description: '无库存管理' },
        { score: 2, description: '高库存依赖' },
        { score: 3, description: '部分优化' },
        { score: 4, description: '高效周转' },
        { score: 5, description: '全球协同库存' },
      ],
    },
    {
      text: '是否构建数字化供应链平台？',
      options: [
        { score: 1, description: '无平台' },
        { score: 2, description: '局部试点' },
        { score: 3, description: '基础功能覆盖' },
        { score: 4, description: '全流程数字化' },
        { score: 5, description: '开放供应链生态' },
      ],
    },
    {
      text: '是否与本地供应商共建技术能力？',
      options: [
        { score: 1, description: '无合作' },
        { score: 2, description: '偶发性交流' },
        { score: 3, description: '局部技术共享' },
        { score: 4, description: '联合研发' },
        { score: 5, description: '技术标准共建' },
      ],
    },
    {
      text: '是否推动绿色供应链或ESG实践？',
      options: [
        { score: 1, description: '无相关措施' },
        { score: 2, description: '局部尝试' },
        { score: 3, description: '基础合规' },
        { score: 4, description: '行业领先实践' },
        { score: 5, description: '全球标杆案例' },
      ],
    },
  ]

  // 创建风险管理维度的问题和选项
  const riskQuestions: Question[] = [
    {
      text: '是否建立风险清单并定期进行压力测试（如汇率波动模拟）？',
      options: [
        { score: 1, description: '无风险意识' },
        { score: 2, description: '偶发性应对' },
        { score: 3, description: '基础风险识别' },
        { score: 4, description: '动态监测机制' },
        { score: 5, description: '风险转化为机遇' },
      ],
    },
    {
      text: '是否通过合规管理系统（如SAP GRC）规避法律陷阱？',
      options: [
        { score: 1, description: '无合规团队' },
        { score: 2, description: '依赖外部律师' },
        { score: 3, description: '基础合规流程' },
        { score: 4, description: '全球合规手册' },
        { score: 5, description: 'ESG驱动抗风险' },
      ],
    },
    {
      text: '是否通过套期保值、多元化布局等手段对冲风险？',
      options: [
        { score: 1, description: '无风险对冲' },
        { score: 2, description: '单一手段' },
        { score: 3, description: '局部对冲' },
        { score: 4, description: '综合风险管理' },
        { score: 5, description: '生态共担风险' },
      ],
    },
    {
      text: '是否制定全球合规手册？',
      options: [
        { score: 1, description: '无合规文件' },
        { score: 2, description: '局部条款' },
        { score: 3, description: '基础手册' },
        { score: 4, description: '动态更新手册' },
        { score: 5, description: '行业标准输出' },
      ],
    },
    {
      text: '是否通过多元化布局分散风险？',
      options: [
        { score: 1, description: '无布局策略' },
        { score: 2, description: '局部尝试' },
        { score: 3, description: '基础分散' },
        { score: 4, description: '主动分散' },
        { score: 5, description: '生态级抗风险' },
      ],
    },
    {
      text: '是否构建风险共担生态？',
      options: [
        { score: 1, description: '无生态合作' },
        { score: 2, description: '局部尝试' },
        { score: 3, description: '基础协作' },
        { score: 4, description: '生态联动' },
        { score: 5, description: '全球风险联盟' },
      ],
    },
  ]

  // 创建跨国协作维度的问题和选项
  const collaborationQuestions: Question[] = [
    {
      text: '是否建立跨区域协作机制（如视频会议、共享平台）？',
      options: [
        { score: 1, description: '无协作渠道' },
        { score: 2, description: '总部单向指令' },
        { score: 3, description: '基础沟通机制' },
        { score: 4, description: '敏捷协作工具' },
        { score: 5, description: '全球生态共建' },
      ],
    },
    {
      text: '是否通过"影子计划"或轮岗培养跨文化领导力？',
      options: [
        { score: 1, description: '无人才计划' },
        { score: 2, description: '局部培训' },
        { score: 3, description: '基础跨文化课程' },
        { score: 4, description: '高管轮岗实践' },
        { score: 5, description: '全球化领导者输出' },
      ],
    },
    {
      text: '是否通过"总部+本地"模型平衡战略意图与执行力？',
      options: [
        { score: 1, description: '总部完全控制' },
        { score: 2, description: '本地被动执行' },
        { score: 3, description: '有限授权' },
        { score: 4, description: '战略与执行联动' },
        { score: 5, description: '生态共赢模式' },
      ],
    },
    {
      text: '是否推行开放式创新并整合合作伙伴资源？',
      options: [
        { score: 1, description: '无创新机制' },
        { score: 2, description: '局部尝试' },
        { score: 3, description: '基础合作' },
        { score: 4, description: '生态协同' },
        { score: 5, description: '行业创新标杆' },
      ],
    },
    {
      text: '是否通过价值观输出提升全球凝聚力？',
      options: [
        { score: 1, description: '无价值观传播' },
        { score: 2, description: '局部尝试' },
        { score: 3, description: '基础传播' },
        { score: 4, description: '文化融合' },
        { score: 5, description: '全球价值观引领' },
      ],
    },
    {
      text: '是否构建全球人才池？',
      options: [
        { score: 1, description: '无人才储备' },
        { score: 2, description: '局部招聘' },
        { score: 3, description: '基础人才库' },
        { score: 4, description: '动态人才管理' },
        { score: 5, description: '全球人才生态' },
      ],
    },
  ]

  // 创建问题和选项的函数
  async function createQuestionsAndOptions(
    questions: Question[],
    dimensionId: number
  ) {
    for (const questionData of questions) {
      const question = await prisma.question.create({
        data: {
          text: questionData.text,
          dimensionId: dimensionId,
          weight: 1.0,
          deleted: false,
        },
      })

      await prisma.questionOption.createMany({
        data: questionData.options.map((option: QuestionOption) => ({
          questionId: question.id,
          score: option.score,
          description: option.description,
        })),
      })
    }
  }

  // 创建战略规划维度的问题
  await createQuestionsAndOptions(strategicQuestions, strategicDimension.id)
  // 创建市场洞察维度的问题
  await createQuestionsAndOptions(marketQuestions, marketDimension.id)

  // 创建产品与品牌国际化维度的问题
  await createQuestionsAndOptions(productQuestions, productDimension.id)

  // 创建供应链维度的问题
  await createQuestionsAndOptions(supplyChainQuestions, supplyChainDimension.id)

  // 创建风险管理维度的问题
  await createQuestionsAndOptions(riskQuestions, riskDimension.id)

  // 创建跨国协作维度的问题
  await createQuestionsAndOptions(
    collaborationQuestions,
    collaborationDimension.id
  )

  // 创建核心策略和行动点
  const coreStrategies = [
    // L1策略
    {
      levelId: maturityLevels[0].id,
      name: '明确战略方向',
      order: 1,
      actions: [
        '制定3-5年出海战略，明确目标市场、核心产品及资源分配',
        '通过"总部+本地"协作模型，建立跨区域资源支持机制',
      ],
    },
    {
      levelId: maturityLevels[0].id,
      name: '建立市场洞察基础',
      order: 2,
      actions: [
        '开展目标市场的基础调研（如人口、政策、消费习惯），构建初步数据库',
        '通过消费者访谈或焦点小组收集需求，验证产品适配性',
      ],
    },
    {
      levelId: maturityLevels[0].id,
      name: '构建最小可行性能力',
      order: 3,
      actions: [
        '在单一市场试点本地化团队（如雇佣本地顾问），测试供应链或物流模式',
        '采用传统广告或KOL合作启动品牌传播，积累初步口碑',
      ],
    },

    // L2策略
    {
      levelId: maturityLevels[1].id,
      name: '战略与执行联动',
      order: 1,
      actions: [
        '将战略目标分解为部门级OKR，建立基础KPI体系（如营收增长率、市场渗透率）',
        '定期复盘战略执行效果，调整资源配置',
      ],
    },
    {
      levelId: maturityLevels[1].id,
      name: '深化市场洞察',
      order: 2,
      actions: [
        '利用大数据分析工具预测市场趋势，动态更新市场数据库',
        '与本地协会或政府建立合作，获取政策支持和行业资源',
      ],
    },
    {
      levelId: maturityLevels[1].id,
      name: '优化供应链与风险管控',
      order: 3,
      actions: [
        '构建初步国际供应链体系（如多元化采购、本地仓储），降低物流成本',
        '通过ERP系统实现供应链可视化，建立基础合规流程',
      ],
    },

    // L3策略
    {
      levelId: maturityLevels[2].id,
      name: '战略动态优化',
      order: 1,
      actions: [
        '建立全球战略情报系统，实时监控市场变化并调整战略',
        '通过反向输出（如技术标准、品牌理念）提升国际话语权',
      ],
    },
    {
      levelId: maturityLevels[2].id,
      name: '深化本地化与品牌化',
      order: 2,
      actions: [
        '构建品牌故事并与本地文化深度融合，通过多渠道整合营销扩大影响力',
        '培养本地人才梯队，建立人才孵化体系',
      ],
    },
    {
      levelId: maturityLevels[2].id,
      name: '强化供应链韧性',
      order: 3,
      actions: [
        '推动绿色供应链或ESG实践，降低环境和社会风险',
        '通过JIT模式优化库存周转，构建开放供应链平台',
      ],
    },

    // L4策略
    {
      levelId: maturityLevels[3].id,
      name: '技术与模式创新',
      order: 1,
      actions: [
        '通过技术突破（如AI、区块链）定义新市场规则，形成差异化竞争力',
        '推动开放式创新，整合全球合作伙伴资源',
      ],
    },
    {
      levelId: maturityLevels[3].id,
      name: '品牌全球化与价值观输出',
      order: 2,
      actions: [
        '构建全球品牌资产库，通过价值观传播（如环保、科技伦理）引领行业趋势',
        '成为行业标准制定者，主导技术或服务规范',
      ],
    },
    {
      levelId: maturityLevels[3].id,
      name: '生态级资源整合',
      order: 3,
      actions: [
        '通过生态联盟（如供应链、渠道、研发）实现跨区域协同',
        '构建全球化人才池，输出"全球化领导者"',
      ],
    },

    // L5策略
    {
      levelId: maturityLevels[4].id,
      name: '行业规则制定',
      order: 1,
      actions: [
        '主导国际标准制定（如技术、服务、合规），定义行业新范式',
        '通过共生战略（如生态联盟）实现价值链共赢',
      ],
    },
    {
      levelId: maturityLevels[4].id,
      name: '全球价值观引领',
      order: 2,
      actions: [
        '以企业愿景驱动社会变革（如碳中和、普惠金融），成为ESG标杆',
        '通过文化输出（如品牌故事、公益活动）重塑全球认知',
      ],
    },
    {
      levelId: maturityLevels[4].id,
      name: '持续生态进化',
      order: 3,
      actions: [
        '构建开放平台（如供应链、创新实验室），赋能中小合作伙伴',
        '通过全球化领导者培养计划，输出管理经验和人才',
      ],
    },
  ]

  // 创建核心策略和行动点的函数
  async function createCoreStrategiesAndActions(strategies: any[]) {
    for (const strategyData of strategies) {
      const strategy = await prisma.coreStrategy.create({
        data: {
          levelId: strategyData.levelId,
          name: strategyData.name,
          order: strategyData.order,
        },
      })

      // 创建策略行动点
      await Promise.all(
        strategyData.actions.map((action: string, index: number) =>
          prisma.coreStrategyAction.create({
            data: {
              strategyId: strategy.id,
              content: action,
              order: index + 1,
            },
          })
        )
      )
    }
  }

  // 创建所有核心策略和行动点
  await createCoreStrategiesAndActions(coreStrategies)

  // 创建维度策略和行动点
  const dimensionStrategies = [
    // 战略规划维度策略
    {
      dimensionId: strategicDimension.id,
      levelId: maturityLevels[0].id, // L1
      definition: '无明确出海战略，依赖短期机会主义决策',
      actions: [
        '建立战略委员会，明确出海目标（如市场份额、品牌影响力）',
        '制定3-5年阶段性规划，与企业整体战略对齐',
        '引入PEST/CAGE模型评估目标市场适配性',
      ],
    },
    {
      dimensionId: strategicDimension.id,
      levelId: maturityLevels[1].id, // L2
      definition: '有初步战略框架，但缺乏动态调整机制',
      actions: [
        '制定详细执行计划（如资源分配、时间节点）',
        '建立战略KPI体系（如市场渗透率、营收增长率）',
        '定期复盘战略执行效果，优化方向',
      ],
    },
    {
      dimensionId: strategicDimension.id,
      levelId: maturityLevels[2].id, // L3
      definition: '战略与执行联动，具备局部灵活性',
      actions: [
        '构建"总部+本地"协作模型，总部提供资源支持，本地团队灵活执行',
        '引入敏捷管理方法（如OKR），快速响应市场变化',
        '通过案例库积累最佳实践，反哺战略迭代',
      ],
    },
    {
      dimensionId: strategicDimension.id,
      levelId: maturityLevels[3].id, // L4
      definition: '战略动态优化，形成全球协同网络',
      actions: [
        '建立全球战略情报系统，实时监控市场趋势',
        '推动跨区域资源整合（如共享服务中心）',
        '通过并购或合资拓展战略边界（如宁德时代与宝马合作）',
      ],
    },
    {
      dimensionId: strategicDimension.id,
      levelId: maturityLevels[4].id, // L5
      definition: '战略驱动创新，引领行业全球化规则',
      actions: [
        '以技术或模式创新定义新市场规则（如TikTok的社交电商模式）',
        '构建生态联盟，主导产业链标准（如华为的5G标准）',
        '通过反向输出（如技术、管理经验）提升国际话语权',
      ],
    },

    // 市场洞察维度策略
    {
      dimensionId: marketDimension.id,
      levelId: maturityLevels[0].id,
      definition: '依赖直觉或有限数据判断市场',
      actions: [
        '建立目标市场数据库（人口、消费习惯、政策法规）',
        '开展小规模试点（如代理销售）验证假设',
        '使用竞品分析工具（如SEMrush）获取市场动态',
      ],
    },
    {
      dimensionId: marketDimension.id,
      levelId: maturityLevels[1].id,
      definition: '有初步市场洞察，但缺乏系统性',
      actions: [
        '利用大数据分析工具预测市场趋势，动态更新市场数据库',
        '与本地协会或政府建立合作，获取政策支持和行业资源',
        '开展本地化团队（如本土顾问）的深度本地化实践',
      ],
    },
    {
      dimensionId: marketDimension.id,
      levelId: maturityLevels[2].id,
      definition: '体系化市场洞察，具备行业领先实践',
      actions: [
        '构建本地化团队（如本土顾问、政府关系），深入理解本地市场',
        '通过消费者焦点小组或NPS调研获取本地化需求',
        '利用大数据分析预测市场趋势，动态更新市场数据库',
      ],
    },
    {
      dimensionId: marketDimension.id,
      levelId: maturityLevels[3].id,
      definition: '动态调整且效果显著',
      actions: [
        '建立本地化团队（如本土顾问、政府关系），深入理解本地市场',
        '通过消费者焦点小组或NPS调研获取本地化需求',
        '利用大数据分析预测市场趋势，动态更新市场数据库',
      ],
    },
    {
      dimensionId: marketDimension.id,
      levelId: maturityLevels[4].id,
      definition: '行业标杆或规则定义者',
      actions: [
        '构建本地化团队（如本土顾问、政府关系），深入理解本地市场',
        '通过消费者焦点小组或NPS调研获取本地化需求',
        '利用大数据分析预测市场趋势，动态更新市场数据库',
      ],
    },

    // 产品与品牌维度策略
    {
      dimensionId: productDimension.id,
      levelId: maturityLevels[0].id,
      definition: '产品直接复制，品牌无差异化',
      actions: [
        '进行产品本地化测试（如适应不同电压标准）',
        '注册国际商标，规避法律风险',
        '制定基础品牌传播策略（如官网多语言支持）',
      ],
    },
    {
      dimensionId: productDimension.id,
      levelId: maturityLevels[1].id,
      definition: '有初步品牌定位，但缺乏深度',
      actions: [
        '明确品牌核心价值主张（如环保、科技感）',
        '通过KOL合作、节日营销等本地化策略推广品牌',
        '构建品牌故事并与本地文化结合',
      ],
    },
    {
      dimensionId: productDimension.id,
      levelId: maturityLevels[2].id,
      definition: '品牌定位清晰，具备行业领先实践',
      actions: [
        '明确品牌核心价值主张（如环保、科技感）',
        '通过KOL合作、节日营销等本地化策略推广品牌',
        '构建品牌故事并与本地文化结合',
      ],
    },
    {
      dimensionId: productDimension.id,
      levelId: maturityLevels[3].id,
      definition: '品牌定位清晰，具备行业领先实践',
      actions: [
        '明确品牌核心价值主张（如环保、科技感）',
        '通过KOL合作、节日营销等本地化策略推广品牌',
        '构建品牌故事并与本地文化结合',
      ],
    },
    {
      dimensionId: productDimension.id,
      levelId: maturityLevels[4].id,
      definition: '行业标杆或规则定义者',
      actions: [
        '明确品牌核心价值主张（如环保、科技感）',
        '通过KOL合作、节日营销等本地化策略推广品牌',
        '构建品牌故事并与本地文化结合',
      ],
    },

    // 供应链维度策略
    {
      dimensionId: supplyChainDimension.id,
      levelId: maturityLevels[0].id,
      definition: '依赖单一供应商，物流效率低',
      actions: [
        '建立供应商风险评估体系（如多元化采购）',
        '与本地物流商合作，降低运输成本',
        '使用ERP系统实现库存可视化',
      ],
    },
    {
      dimensionId: supplyChainDimension.id,
      levelId: maturityLevels[1].id,
      definition: '有初步供应链体系，但效率不足',
      actions: [
        '建立初步国际供应链体系（如多元化采购、本地仓储），降低物流成本',
        '通过ERP系统实现供应链可视化，建立基础合规流程',
        '推动绿色供应链或ESG实践',
      ],
    },
    {
      dimensionId: supplyChainDimension.id,
      levelId: maturityLevels[2].id,
      definition: '体系化供应链管理，具备行业领先实践',
      actions: [
        '推动绿色供应链或ESG实践，降低环境和社会风险',
        '通过JIT模式优化库存周转，构建开放供应链平台',
        '与本地供应商共建技术能力',
      ],
    },
    {
      dimensionId: supplyChainDimension.id,
      levelId: maturityLevels[3].id,
      definition: '动态调整且效果显著',
      actions: [
        '推动绿色供应链或ESG实践，降低环境和社会风险',
        '通过JIT模式优化库存周转，构建开放供应链平台',
        '与本地供应商共建技术能力',
      ],
    },
    {
      dimensionId: supplyChainDimension.id,
      levelId: maturityLevels[4].id,
      definition: '行业标杆或规则定义者',
      actions: [
        '推动绿色供应链或ESG实践，降低环境和社会风险',
        '通过JIT模式优化库存周转，构建开放供应链平台',
        '与本地供应商共建技术能力',
      ],
    },

    // 风险管理维度策略
    {
      dimensionId: riskDimension.id,
      levelId: maturityLevels[0].id,
      definition: '无系统风险管理体系',
      actions: [
        '建立合规团队，研究目标市场法律法规',
        '购买国际商业保险（如政治风险保险）',
        '制定基础危机应对流程（如罢工预案）',
      ],
    },
    {
      dimensionId: riskDimension.id,
      levelId: maturityLevels[1].id,
      definition: '有初步风险管理，但缺乏系统性',
      actions: [
        '建立合规团队，研究目标市场法律法规',
        '购买国际商业保险（如政治风险保险）',
        '制定基础危机应对流程（如罢工预案）',
      ],
    },
    {
      dimensionId: riskDimension.id,
      levelId: maturityLevels[2].id,
      definition: '体系化风险管理，具备行业领先实践',
      actions: [
        '通过合规管理系统（如SAP GRC）规避法律陷阱',
        '通过套期保值、多元化布局等手段对冲风险',
        '制定全球合规手册',
      ],
    },
    {
      dimensionId: riskDimension.id,
      levelId: maturityLevels[3].id,
      definition: '动态调整且效果显著',
      actions: [
        '通过合规管理系统（如SAP GRC）规避法律陷阱',
        '通过套期保值、多元化布局等手段对冲风险',
        '制定全球合规手册',
      ],
    },
    {
      dimensionId: riskDimension.id,
      levelId: maturityLevels[4].id,
      definition: '行业标杆或规则定义者',
      actions: [
        '通过合规管理系统（如SAP GRC）规避法律陷阱',
        '通过套期保值、多元化布局等手段对冲风险',
        '制定全球合规手册',
      ],
    },

    // 跨国协作维度策略
    {
      dimensionId: collaborationDimension.id,
      levelId: maturityLevels[0].id,
      definition: '总部主导，本地团队被动执行',
      actions: [
        '建立跨区域沟通机制（如定期视频会议）',
        '提供跨文化培训（如冲突解决技巧）',
        '设立本地决策权限（如预算审批额度）',
      ],
    },
    {
      dimensionId: collaborationDimension.id,
      levelId: maturityLevels[1].id,
      definition: '有初步跨国协作，但缺乏系统性',
      actions: [
        '建立跨区域沟通机制（如定期视频会议）',
        '提供跨文化培训（如冲突解决技巧）',
        '设立本地决策权限（如预算审批额度）',
      ],
    },
    {
      dimensionId: collaborationDimension.id,
      levelId: maturityLevels[2].id,
      definition: '体系化跨国协作，具备行业领先实践',
      actions: [
        '通过"影子计划"或轮岗培养跨文化领导力',
        '通过"总部+本地"模型平衡战略意图与执行力',
        '推行开放式创新并整合合作伙伴资源',
      ],
    },
    {
      dimensionId: collaborationDimension.id,
      levelId: maturityLevels[3].id,
      definition: '动态调整且效果显著',
      actions: [
        '通过"影子计划"或轮岗培养跨文化领导力',
        '通过"总部+本地"模型平衡战略意图与执行力',
        '推行开放式创新并整合合作伙伴资源',
      ],
    },
    {
      dimensionId: collaborationDimension.id,
      levelId: maturityLevels[4].id,
      definition: '行业标杆或规则定义者',
      actions: [
        '通过"影子计划"或轮岗培养跨文化领导力',
        '通过"总部+本地"模型平衡战略意图与执行力',
        '推行开放式创新并整合合作伙伴资源',
      ],
    },
  ]

  // 创建维度策略和行动点的函数
  async function createDimensionStrategiesAndActions(strategies: any[]) {
    for (const strategyData of strategies) {
      const dimensionStrategy = await prisma.dimensionStrategy.create({
        data: {
          dimensionId: strategyData.dimensionId,
          levelId: strategyData.levelId,
          definition: strategyData.definition,
        },
      })

      // 创建策略行动点
      await Promise.all(
        strategyData.actions.map((action: string, index: number) =>
          prisma.strategyAction.create({
            data: {
              dimensionStrategyId: dimensionStrategy.id,
              dimensionId: strategyData.dimensionId,
              levelId: strategyData.levelId,
              content: action,
              order: index + 1,
            },
          })
        )
      )
    }
  }

  // 创建所有维度策略和行动点
  await createDimensionStrategiesAndActions(dimensionStrategies)

  console.log('数据库初始化完成')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
