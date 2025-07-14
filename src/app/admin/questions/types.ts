export interface Question {
  id: number
  text: string
  explanation: string | null
  dimensionId: number
  dimension: {
    id: number
    name: string
    deleted: boolean
  }
  createdAt: Date
  updatedAt: Date
  deleted: boolean
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
  explanation?: string
  dimensionId: number
} 