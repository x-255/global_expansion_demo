import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

interface Answer {
  questionId: number
  answer: number | null
}

// 定义store的类型
interface AssessmentStore {
  answers: Answer[]
  setAnswers: (answers: Answer[]) => void
  clearAnswers: () => void
  hydrated: boolean
  setHydrated: (state: boolean) => void
}

// 创建store
export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    devtools(
      (set) => ({
        // 初始状态
        answers: [],
        hydrated: false,

        // 设置答案
        setAnswers: (answers) => {
          set({ answers }, false, 'assessment/setAnswers')
        },

        // 清除答案
        clearAnswers: () => {
          set({ answers: [] }, false, 'assessment/clearAnswers')
        },

        // 设置 hydration 状态
        setHydrated: (state) => {
          set({ hydrated: state }, false, 'assessment/setHydrated')
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
      onRehydrateStorage: () => (hydratedState) => {
        // 使用 setTimeout 确保在下一个事件循环中设置状态
        setTimeout(() => {
          useAssessmentStore.getState().setHydrated(true)
        }, 0)
      },
    }
  )
)
