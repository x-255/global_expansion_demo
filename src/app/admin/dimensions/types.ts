import type { Question } from '@/generated/prisma/client'

export interface Dimension {
  id: number
  name: string
  description: string
  questions: Question[]
  createdAt: Date
  updatedAt: Date
  deleted: boolean
}

export interface DimensionFormData {
  name: string
  description: string
} 