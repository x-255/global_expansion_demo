import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '评估结果',
  description: '查看您的企业出海能力评估的详细分析结果',
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
