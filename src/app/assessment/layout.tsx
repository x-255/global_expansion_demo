import { Metadata } from 'next'
import { getCompanyCookie } from '@/lib/cookies'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: '企业出海能力评估',
  description: '评估您的企业在全球化扩张中的各项关键能力',
}

export default async function AssessmentLayout({
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
