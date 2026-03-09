import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-secondary-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 rounded-lg border text-secondary-900 text-sm
              placeholder:text-secondary-400
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-secondary-50
              transition-all duration-200
              ${error ? 'border-red-400 bg-red-50' : 'border-secondary-200 bg-white hover:border-secondary-300'}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {helperText && !error && <p className="text-xs text-secondary-400">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-secondary-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg border text-secondary-900 text-sm
            placeholder:text-secondary-400 resize-none
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all duration-200
            ${error ? 'border-red-400 bg-red-50' : 'border-secondary-200 bg-white hover:border-secondary-300'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Input