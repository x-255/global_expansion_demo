import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '企业出海能力评估',
  description: '评估您的企业在全球化进程中的优势与挑战',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">{children}</body>
    </html>
  )
}
