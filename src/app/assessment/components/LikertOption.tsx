interface LikertOptionProps {
  option: {
    label: string
    color: string
    size: number
  }
  optIdx: number
  qIdx: number
  selected: boolean
  isHovered: boolean
  onSelect: (qIdx: number, optIdx: number) => void
  onHover: (qIdx: number, optIdx: number | null) => void
}

export function LikertOption({
  option,
  optIdx,
  qIdx,
  selected,
  isHovered,
  onSelect,
  onHover,
}: LikertOptionProps) {
  const size =
    typeof window !== 'undefined' && window.innerWidth < 640
      ? option.size * 0.8
      : option.size

  return (
    <div className="relative flex flex-col items-center">
      <button
        type="button"
        className={`transition-all duration-150 rounded-full flex items-center justify-center focus:outline-none cursor-pointer
          ${option.color} ${isHovered ? 'scale-110 shadow-lg' : ''}
        `}
        style={{
          width: size,
          height: size,
        }}
        onClick={() => onSelect(qIdx, optIdx)}
        onMouseEnter={() => onHover(qIdx, optIdx)}
        onMouseLeave={() => onHover(qIdx, null)}
        aria-label={option.label}
      >
        {selected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width={Math.round(size * 0.5)}
              height={Math.round(size * 0.5)}
              viewBox="0 0 24 24"
              className="text-white"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12.6L9 18L20 6"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </button>
      {/* tooltips效果：仅hover时显示 */}
      {isHovered && !selected && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-black bg-opacity-80 text-white text-sm rounded shadow z-10 whitespace-nowrap">
          {option.label}
        </span>
      )}
    </div>
  )
}
