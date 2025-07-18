import type {
  CoreStrategy,
  CoreStrategyAction,
  MaturityLevel,
} from '@/generated/prisma/client'

export interface CoreStrategyWithDetails extends CoreStrategy {
  level: MaturityLevel
  actions: CoreStrategyAction[]
}

export interface CoreStrategyFormData {
  name: string
  levelId: number
  order: number
  actions: {
    id?: number
    content: string
    order: number
  }[]
}
