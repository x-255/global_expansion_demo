import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { dimensions } from '../assessment/assessmentModel'

// 定义store的类型
interface AssessmentStore {
  answers: (number | null)[][]
  setAnswers: (answers: (number | null)[][]) => void
  clearAnswers: () => void
}

// 创建store
export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    devtools(
      (set) => ({
        // 初始状态
        answers: dimensions.map((d) => Array(d.questions.length).fill(null)),

        // 设置答案
        setAnswers: (answers) => {
          set({ answers }, false, 'assessment/setAnswers')
        },

        // 清除答案
        clearAnswers: () => {
          const emptyAnswers = dimensions.map((d) =>
            Array(d.questions.length).fill(null)
          )
          set({ answers: emptyAnswers }, false, 'assessment/clearAnswers')
        },
      }),
      {
        name: 'Assessment Store',
        enabled: process.env.NODE_ENV === 'development',
      }
    ),
    {
      name: 'assessment-storage',
      storage:
        typeof window !== 'undefined'
          ? createJSONStorage(() => sessionStorage)
          : undefined,
    }
  )
)
