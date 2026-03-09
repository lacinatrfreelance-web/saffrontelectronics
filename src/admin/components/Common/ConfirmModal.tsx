import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
  confirmLabel?: string
  variant?: 'danger' | 'warning'
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
  confirmLabel = 'Confirmer',
  variant = 'danger',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1 text-secondary-400 hover:text-secondary-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'
            }`}>
              <AlertTriangle size={22} className={variant === 'danger' ? 'text-red-500' : 'text-amber-500'} />
            </div>

            <h3 className="font-display text-lg font-bold text-secondary-900 mb-2">{title}</h3>
            <p className="text-secondary-600 text-sm mb-6">{message}</p>

            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={onCancel} disabled={loading}>
                Annuler
              </Button>
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onClick={onConfirm}
                loading={loading}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmModal