import React from 'react'

export interface Column<T = unknown> {
  key: string
  title: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, record: T, index: number) => React.ReactNode
  sortable?: boolean
}

export interface TableProps<T = unknown> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyText?: string
  className?: string
  onRowClick?: (record: T, index: number) => void
  rowKey?: string | ((record: T) => string | number)
}

function Table<T = unknown>({
  columns,
  data,
  loading = false,
  emptyText = '暂无数据',
  className = '',
  onRowClick,
  rowKey = 'id',
}: TableProps<T>) {
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record)
    }
    return (
      ((record as Record<string, unknown>)[rowKey] as string | number) || index
    )
  }

  const getValue = (record: T, key: string): unknown => {
    return key
      .split('.')
      .reduce(
        (obj: unknown, k: string) => (obj as Record<string, unknown>)?.[k],
        record as Record<string, unknown>
      )
  }

  if (loading) {
    return (
      <div className={`admin-card ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-gray-500">加载中...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={`px-6 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200 text-${
                    column.align || 'left'
                  } ${
                    column.sortable ? 'cursor-pointer hover:bg-slate-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {column.title}
                    {column.sortable && (
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <svg
                      className="w-12 h-12 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-gray-500">{emptyText}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr
                  key={getRowKey(record, index)}
                  className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(record, index)}
                >
                  {columns.map((column) => {
                    const value = getValue(record, column.key)
                    const content = column.render
                      ? column.render(value, record, index)
                      : (value as React.ReactNode)

                    return (
                      <td
                        key={column.key}
                        className={`px-6 py-4 text-sm text-${
                          column.align || 'left'
                        }`}
                      >
                        {content}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table
