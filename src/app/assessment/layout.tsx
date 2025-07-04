import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '企业出海能力评估',
  description: '评估您的企业在全球化扩张中的各项关键能力',
}

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
