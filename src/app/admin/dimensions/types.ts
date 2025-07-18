import type { Dimension, Question } from '../../../generated/prisma/client'

export type { Dimension }

export interface DimensionFormData {
  name: string
  description: string | null
  coreCapability: string
  weight: number
  order: number
  maturityLevelDescriptions: Array<{
    levelId: number
    definition: string
    strategies: string[]
  }>
}

export interface DimensionWithQuestions extends Dimension {
  questions: Question[]
  DimensionStrategy?: Array<{
    id: number
    levelId: number
    definition: string
    level?: {
      name: string
      minScore: number
      maxScore: number
    }
    actions?: Array<{
      content: string
    }>
  }>
}
