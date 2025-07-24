'use client'

import React, { useEffect } from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
}

export interface ModalHeaderProps {
  children: React.ReactNode
  onClose?: () => void
  showCloseButton?: boolean
}

export interface ModalBodyProps {
  children: React.ReactNode
  className?: string
}

export interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

const Modal: React.FC<ModalProps> & {
  Header: React.FC<ModalHeaderProps>
  Body: React.FC<ModalBodyProps>
  Footer: React.FC<ModalFooterProps>
} = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
      >
        {title && (
          <Modal.Header onClose={onClose} showCloseButton={showCloseButton}>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          </Modal.Header>
        )}
        {children}
      </div>
    </div>
  )
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  onClose,
  showCloseButton = true,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 rounded-t-xl bg-slate-50">
      <div className="flex-1">{children}</div>
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`flex-1 p-6 ${className}`}
      style={{
        minHeight: 0,
        overflowY: 'auto',
        maxHeight: 'calc(90vh - 140px)', // 减去header和footer的高度
      }}
    >
      {children}
    </div>
  )
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-end gap-3 ${className}`}
    >
      {children}
    </div>
  )
}

Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export default Modal
