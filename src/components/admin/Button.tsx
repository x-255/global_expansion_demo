import React from 'react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
      primary:
        'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 hover:border-indigo-700 focus:ring-indigo-500',
      secondary:
        'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400 focus:ring-slate-500',
      success:
        'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 hover:border-emerald-700 focus:ring-emerald-500',
      warning:
        'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 hover:border-amber-600 focus:ring-amber-500',
      error:
        'bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 focus:ring-red-500',
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs h-8',
      md: 'px-4 py-2 text-sm h-9',
      lg: 'px-6 py-2.5 text-base h-11',
    }

    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
        )}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
