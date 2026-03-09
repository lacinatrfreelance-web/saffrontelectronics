import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm',
  secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white bg-transparent',
  ghost: 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 bg-transparent',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-7 py-3.5 text-base rounded-lg gap-2.5',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 focus:outline-none focus:ring-2
        focus:ring-primary-500 focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" />
      ) : (
        icon && iconPosition === 'left' && icon
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </motion.button>
  )
}

export default Button