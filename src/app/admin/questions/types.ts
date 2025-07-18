export interface Question {
  id: number
  text: string
  dimensionId: number
  dimension: {
    id: number
    name: string
    deleted: boolean
  }
  weight: number
  order: number
  createdAt: Date
  updatedAt: Date
  deleted: boolean
  options: QuestionOption[]
}

export type QuestionOption = {
  id: number
  questionId: number
  description: string
  score: number
  createdAt: Date
  updatedAt: Date
}

export type Dimension = {
  id: number
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
}

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
