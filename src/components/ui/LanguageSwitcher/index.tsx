import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n' 
import { ChevronDown, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const LANGUAGES = [
  { code: 'fr', label: 'Francais', flag: '🇨🇮' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark'
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'light',
}) => {
  const { t } = useTranslation() // Gardez t pour les traductions
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Utilisez i18n.language directement depuis l'instance importée
  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0]

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code) // Utilisez l'instance importée
    setOpen(false)
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isDark = variant === 'dark'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          isDark
            ? 'text-secondary-300 hover:text-white hover:bg-secondary-800'
            : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
        }`}
      >
        <Globe size={15} />
        <span>{current.flag}</span>
        <span className="hidden sm:block">{current.label}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-lg border border-secondary-100 overflow-hidden z-50 min-w-[140px]"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  i18n.language === lang.code
                    ? 'bg-primary-50 text-primary-600 font-semibold'
                    : 'text-secondary-700 hover:bg-secondary-50'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
                {i18n.language === lang.code && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSwitcher