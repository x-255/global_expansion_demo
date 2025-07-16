import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const assessment = await prisma.companyAssessment.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      include: {
        company: true,
      },
    })

    if (!assessment) {
      return new NextResponse('评估记录不存在', { status: 404 })
    }

    return NextResponse.json(assessment)
  } catch (error) {
    console.error('获取评估记录失败:', error)
    return new NextResponse('获取评估记录失败', { status: 500 })
  }
}
