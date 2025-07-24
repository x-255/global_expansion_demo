import React from 'react'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      leftIcon,
      rightIcon,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm h-8',
      md: 'px-3 py-2 text-sm h-9',
      lg: 'px-4 py-2.5 text-base h-11',
    }

    const inputClasses = [
      'w-full border border-slate-300 rounded-lg transition-all duration-200 bg-white',
      'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500',
      'placeholder:text-slate-400',
      sizeClasses[size],
      leftIcon ? 'pl-9' : '',
      rightIcon ? 'pr-9' : '',
      error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{leftIcon}</div>
            </div>
          )}
          <input ref={ref} className={inputClasses} {...props} />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{rightIcon}</div>
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
