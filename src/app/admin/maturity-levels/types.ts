import type { MaturityLevel } from '../../../generated/prisma/client'

export type { MaturityLevel }

export interface MaturityLevelFormData {
  level: number
  name: string
  description: string
  coreFeatures: string
  minScore: number
  maxScore: number
}
