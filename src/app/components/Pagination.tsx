interface PaginationProps {
  currentPage: number
  total: number
  pageSize?: number
  className?: string
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, total, onPageChange, className = '', pageSize = 10 }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  
  if (totalPages <= 1) {
    return null
  }

  const getVisiblePages = () => {
    const delta = 2 // 当前页前后显示的页数
    const rangeWithDots = []

    // 如果总页数小于等于7，显示所有页码
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        rangeWithDots.push(i)
      }
      return rangeWithDots
    }

    // 总是显示第一页
    rangeWithDots.push(1)

    // 如果当前页离第一页很近
    if (currentPage <= 4) {
      for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
        rangeWithDots.push(i)
      }
      if (totalPages > 5) {
        rangeWithDots.push('...')
      }
    }
    // 如果当前页离最后一页很近
    else if (currentPage >= totalPages - 3) {
      rangeWithDots.push('...')
      for (let i = Math.max(totalPages - 4, 2); i <= totalPages - 1; i++) {
        rangeWithDots.push(i)
      }
    }
    // 当前页在中间
    else {
      rangeWithDots.push('...')
      for (let i = currentPage - delta; i <= currentPage + delta; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...')
    }

    // 总是显示最后一页（如果不是第一页）
    if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {/* 上一页按钮 */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer transition-colors"
        title="上一页"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* 页码按钮 */}
      {visiblePages.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`dots-${index}`}
              className="flex items-center justify-center w-10 h-10 text-gray-500 cursor-default"
            >
              ...
            </span>
          )
        }

        const pageNumber = page as number
        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`flex items-center justify-center w-10 h-10 border rounded-md cursor-pointer transition-colors font-medium ${
              currentPage === pageNumber
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'hover:bg-gray-50 border-gray-300 text-gray-700'
            }`}
          >
            {pageNumber}
          </button>
        )
      })}

      {/* 下一页按钮 */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer transition-colors"
        title="下一页"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  )
}
