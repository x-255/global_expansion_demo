import React from 'react'

export interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export interface CardHeaderProps {
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

export interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

export interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>
  Body: React.FC<CardBodyProps>
  Footer: React.FC<CardFooterProps>
} = ({ children, className = '', padding = 'md', hover = false }) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const classes = [
    'bg-white border border-slate-200 rounded-lg shadow-sm transition-all duration-200',
    hover ? 'cursor-pointer hover:shadow-md hover:border-slate-300' : '',
    paddingClasses[padding],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  actions,
}) => {
  return (
    <div
      className={`flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-lg ${className}`}
    >
      <div className="flex-1">{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>
}

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-lg ${className}`}
    >
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card
