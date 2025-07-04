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
  return (
    <div className="w-full flex justify-between gap-6 px-6 sm:px-12 pb-12">
      {groupIdx > 0 && (
        <button
          className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full text-lg font-semibold shadow hover:bg-gray-300 transition-all flex items-center gap-2"
          onClick={onPrevious}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-700"
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
      )}
      <div className="flex-1" />
      {isCurrentGroupAnswered && (
        <button
          className="px-8 py-3 bg-green-600 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
          onClick={groupIdx === totalGroups - 1 ? onComplete : onNext}
        >
          <span>{groupIdx === totalGroups - 1 ? '完成评估' : '下一组'}</span>
          {groupIdx === totalGroups - 1 ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
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
              className="text-white"
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
      )}
    </div>
  )
}
