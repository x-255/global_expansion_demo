import { PrismaClient } from '../src/generated/prisma'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 清理现有数据
  await prisma.question.deleteMany()
  await prisma.dimension.deleteMany()
  await prisma.admin.deleteMany()

  // 创建初始管理员
  const hashedPassword = await hash('123123', 10)
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: '系统管理员'
    }
  })

  // 创建维度
  const marketDimension = await prisma.dimension.create({
    data: {
      name: '市场潜力',
      description: '评估目标市场的规模、增长潜力和竞争格局',
    },
  })

  const operationDimension = await prisma.dimension.create({
    data: {
      name: '运营能力',
      description: '评估公司的运营效率和管理能力',
    },
  })

  const localizationDimension = await prisma.dimension.create({
    data: {
      name: '本地化能力',
      description: '评估公司适应目标市场的能力',
    },
  })

  // 创建问题
  await prisma.question.createMany({
    data: [
      // 市场潜力维度的问题
      {
        text: '目标市场的规模和增长率如何？',
        explanation: '考虑市场的当前规模和预期年增长率',
        dimensionId: marketDimension.id,
      },
      {
        text: '市场竞争格局如何？',
        explanation: '评估主要竞争对手的数量和市场份额',
        dimensionId: marketDimension.id,
      },
      {
        text: '是否存在明显的市场进入壁垒？',
        explanation: '考虑监管、技术、资金等方面的进入壁垒',
        dimensionId: marketDimension.id,
      },

      // 运营能力维度的问题
      {
        text: '是否建立了完善的供应链体系？',
        explanation: '评估供应商管理、库存控制等方面',
        dimensionId: operationDimension.id,
      },
      {
        text: '是否具备足够的人力资源？',
        explanation: '考虑人才储备和招聘能力',
        dimensionId: operationDimension.id,
      },
      {
        text: '是否有效的质量控制体系？',
        explanation: '评估产品/服务质量管理能力',
        dimensionId: operationDimension.id,
      },

      // 本地化能力维度的问题
      {
        text: '是否了解当地文化和消费习惯？',
        explanation: '评估对目标市场文化的理解程度',
        dimensionId: localizationDimension.id,
      },
      {
        text: '是否具备本地化的营销能力？',
        explanation: '考虑营销策略的本地化程度',
        dimensionId: localizationDimension.id,
      },
      {
        text: '是否建立了本地合作伙伴关系？',
        explanation: '评估与当地合作伙伴的合作情况',
        dimensionId: localizationDimension.id,
      },
    ],
  })

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