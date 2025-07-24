'use server'

import { prisma } from '@/lib/prisma'

export interface DashboardStats {
  companiesCount: number
  assessmentsCount: number
  activeUsersCount: number
  thisMonthAssessments: number
}

export interface RecentAssessment {
  id: number
  companyId: number
  companyName: string
  createdAt: Date
  status: string
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // 获取企业总数
    const companiesCount = await prisma.company.count()

    // 获取评估总数
    const assessmentsCount = await prisma.companyAssessment.count()

    // 获取活跃用户数（这里简单用管理员数量代替）
    const activeUsersCount = await prisma.admin.count()

    // 获取本月评估数量
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthAssessments = await prisma.companyAssessment.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    })

    return {
      companiesCount,
      assessmentsCount,
      activeUsersCount,
      thisMonthAssessments,
    }
  } catch (error) {
    console.error('获取仪表板统计数据失败:', error)
    return {
      companiesCount: 0,
      assessmentsCount: 0,
      activeUsersCount: 0,
      thisMonthAssessments: 0,
    }
  }
}

export async function getRecentAssessments(): Promise<RecentAssessment[]> {
  try {
    const assessments = await prisma.companyAssessment.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    })

    return assessments.map((assessment) => ({
      id: assessment.id,
      companyId: assessment.companyId,
      companyName: assessment.company.name,
      createdAt: assessment.createdAt,
      status: '已完成', // 简化状态显示
    }))
  } catch (error) {
    console.error('获取最近评估失败:', error)
    return []
  }
}
