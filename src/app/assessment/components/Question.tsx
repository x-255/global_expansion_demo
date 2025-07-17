import { LikertOption } from './LikertOption'
import { Question as QuestionType } from '@/generated/prisma/client'

// 5级Likert风格选项
const likertOptions = [
  { label: '非常反对', color: 'bg-purple-500', size: 54 },
  { label: '反对', color: 'bg-purple-300', size: 44 },
  { label: '不确定', color: 'bg-gray-300', size: 36 },
  { label: '同意', color: 'bg-green-300', size: 44 },
  { label: '非常同意', color: 'bg-green-500', size: 54 },
]

const likertLabels = ['反对', '同意']

interface QuestionProps {
  question: QuestionType
  qIdx: number
  isAnswered: boolean
  selectedOption: number | null
  hovered: { qIdx: number; optIdx: number } | null
  onSelect: (qIdx: number, optIdx: number) => void
  onHover: (qIdx: number, optIdx: number | null) => void
  ref?: React.RefCallback<HTMLDivElement>
}

export function Question({
  question,
  qIdx,
  isAnswered,
  selectedOption,
  hovered,
  onSelect,
  onHover,
  ref,
}: QuestionProps) {
  return (
    <div
      ref={ref}
      className={`mb-2 p-7 transition-opacity duration-300 ${
        isAnswered ? 'opacity-60' : 'opacity-100'
      }`}
    >
      <div className="flex items-start mb-6">
        <div className="flex-1">
          <div className="text-xl text-gray-800 font-semibold tracking-wide">
            <span className="text-primary font-bold text-lg">
              {question.text}
            </span>
          </div>
          {question.explanation && (
            <div className="mt-2 text-gray-3">{question.explanation}</div>
          )}
        </div>
      </div>

      <div className="flex flex-row items-center justify-center gap-4 select-none px-4 sm:px-0">
        {/* 左侧"反对"标签 */}
        <span className="mr-2 sm:mr-4 text-purple-600 text-lg font-bold w-8 sm:w-12 text-right">
          {likertLabels[0]}
        </span>
        {/* 5个圆点 */}
        {likertOptions.map((opt, optIdx) => (
          <LikertOption
            key={optIdx}
            option={opt}
            optIdx={optIdx}
            qIdx={qIdx}
            selected={selectedOption === optIdx}
            isHovered={hovered?.qIdx === qIdx && hovered?.optIdx === optIdx}
            onSelect={onSelect}
            onHover={onHover}
          />
        ))}
        {/* 右侧"同意"标签 */}
        <span className="ml-2 sm:ml-4 text-green-600 text-lg font-bold w-8 sm:w-12 text-left">
          {likertLabels[1]}
        </span>
      </div>
    </div>
  )
}
