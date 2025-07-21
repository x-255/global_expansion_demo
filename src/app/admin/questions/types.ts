import type {
  Question as PrismaQuestion,
  QuestionOption as PrismaQuestionOption,
  Dimension as PrismaDimension,
} from '@/generated/prisma/client'

export interface Question extends PrismaQuestion {
  dimension: {
    id: number
    name: string
    deleted: boolean
  }
  options: QuestionOption[]
}

export type QuestionOption = PrismaQuestionOption

export type Dimension = PrismaDimension

export interface QuestionFormData {
  text: string
  dimensionId: number
  weight: number
  order: number
  options: Array<{
    description: string
    score: number
  }>
}

export type QuestionWithOptions = Question
