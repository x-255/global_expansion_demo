interface NavigationButtonsProps {
  groupIdx: number
  totalGroups: number
  isCurrentGroupAnswered: boolean
  onPrevious: () => void
  onNext: () => void
  onComplete: () => void
}

export function NavigationButtons({
  groupIdx,
  totalGroups,
  isCurrentGroupAnswered,
  onPrevious,
  onNext,
  onComplete,
}: NavigationButtonsProps) {
  const showPreviousButton = groupIdx > 0
  const isLastGroup = groupIdx === totalGroups - 1

  return (
    <div className="flex justify-between items-center px-8 py-6 border-t border-gray-700">
      {/* 上一组按钮 */}
      {showPreviousButton ? (
        <button
          className="px-8 py-3 bg-primary text-white rounded-full text-lg font-semibold shadow hover:bg-gold transition-all flex items-center gap-2"
          onClick={onPrevious}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>上一组</span>
        </button>
      ) : (
        // 占位元素保持布局
        <div />
      )}

      {/* 下一组/完成按钮 */}
      <button
        className={`px-8 py-3 rounded-full text-lg font-semibold shadow transition-all flex items-center gap-2 ${
          isCurrentGroupAnswered
            ? 'bg-primary text-white hover:bg-gold'
            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
        }`}
        onClick={isLastGroup ? onComplete : onNext}
        disabled={!isCurrentGroupAnswered}
      >
        <span>{isLastGroup ? '完成评估' : '下一组'}</span>
        {isLastGroup ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-current"
          >
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-current"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
