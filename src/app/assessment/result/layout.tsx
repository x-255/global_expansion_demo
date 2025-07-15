import { Metadata } from 'next'
import { getCompanyCookie } from '@/lib/cookies'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: '评估结果',
  description: '查看您的企业出海能力评估的详细分析结果',
}

export default async function ResultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const companyName = await getCompanyCookie()
  
  if (!companyName) {
    redirect('/')
  }

  return children
}
