'use client'
import { Suspense } from 'react'
import { AssessmentsList } from './AssessmentsList'
import AssessmentHeader from './AssessmentHeader'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function CompanyAssessmentsPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <AssessmentHeader params={params} />
      <AssessmentsList params={params} />
    </Suspense>
  )
}
