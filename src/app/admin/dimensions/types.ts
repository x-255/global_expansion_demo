import type { Dimension, Question } from '../../../generated/prisma/client'

export type { Dimension }

export interface DimensionFormData {
  name: string
  description: string | null
}

export interface DimensionWithQuestions extends Dimension {
  questions: Question[]
}
