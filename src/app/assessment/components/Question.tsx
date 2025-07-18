import {
  Question as QuestionType,
  QuestionOption,
} from '@/generated/prisma/client'

interface QuestionProps {
  question: QuestionType & {
    options: QuestionOption[]
  }
  qIdx: number
  isAnswered: boolean
  selectedOption: number | null // 现在这是选项ID而不是索引
  onSelect: (qIdx: number, optIdx: number) => void
  ref?: React.RefCallback<HTMLDivElement>
}

export function Question({
  question,
  qIdx,
  isAnswered,
  selectedOption,
  onSelect,
  ref,
}: QuestionProps) {
  return (
    <div
      ref={ref}
      className={`mb-12 transition-opacity duration-300 ${
        isAnswered ? 'opacity-60' : 'opacity-100'
      }`}
    >
      {/* 问题标题部分 */}
      <div className="mb-8">
        <h3 className="text-xl text-white font-medium">{question.text}</h3>
        {question.explanation && (
          <p className="mt-3 text-gray-300">{question.explanation}</p>
        )}
      </div>

      {/* 选项列表 */}
      <div className="flex flex-col space-y-6">
        {question.options
          .sort((a, b) => b.score - a.score)
          .map((option, optIdx) => (
            <div
              key={option.id}
              className="flex items-center cursor-pointer group"
              onClick={() => onSelect(qIdx, optIdx)}
            >
              <div
                className={`relative flex-shrink-0 w-6 h-6 border-2 rounded-full transition-colors mr-4
                ${
                  selectedOption === option.id
                    ? 'border-primary'
                    : 'border-gray-500 group-hover:border-gray-300'
                }`}
              >
                {selectedOption === option.id && (
                  <div className="absolute inset-1 bg-primary rounded-full" />
                )}
              </div>
              <span
                className={`text-lg transition-colors
                ${
                  selectedOption === option.id
                    ? 'text-primary font-medium'
                    : 'text-gray-300 group-hover:text-gray-200'
                }`}
              >
                {option.description}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}
