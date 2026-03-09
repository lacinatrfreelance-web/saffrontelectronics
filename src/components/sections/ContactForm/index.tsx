import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Send, CheckCircle, User, Mail, Phone, MessageSquare, AlignLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContactForm } from '@/hooks/useContactForm'
import type { ContactFormData } from '@/types/product.types'

// Le schéma de validation utilise t() via une factory pour que les messages
// soient re-évalués à chaque changement de langue
const makeSchema = (t: (key: string, opts?: any) => string) =>
  z.object({
    name:    z.string().min(2,  t('contactForm.errorName')),
    email:   z.string().email(  t('contactForm.errorEmail')),
    phone:   z.string().optional(),
    subject: z.string().min(5,  t('contactForm.errorSubject')),
    message: z.string().min(20, t('contactForm.errorMessage')),
  })

interface FloatingFieldProps {
  label: string
  icon: React.ReactNode
  error?: string
  children: React.ReactNode
}

const FloatingField: React.FC<FloatingFieldProps> = ({ label, icon, error, children }) => (
  <div className="group">
    <div className={`relative flex items-center bg-white border-2 rounded-2xl transition-all duration-200 ${
      error
        ? 'border-red-300 bg-red-50/30'
        : 'border-gray-100 focus-within:border-orange-400 focus-within:shadow-[0_0_0_4px_rgba(249,115,22,0.08)]'
    }`}>
      <div className="absolute left-4 text-gray-300 group-focus-within:text-orange-400 transition-colors duration-200 pointer-events-none">
        {icon}
      </div>
      {children}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          className="text-xs text-red-500 font-medium mt-1.5 ml-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
)

const inputClass = "w-full pl-11 pr-4 py-4 bg-transparent text-gray-900 text-sm font-medium placeholder-gray-300 outline-none rounded-2xl"
const taClass    = "w-full pl-11 pr-4 py-4 bg-transparent text-gray-900 text-sm font-medium placeholder-gray-300 outline-none rounded-2xl resize-none"

export const ContactForm: React.FC = () => {
  const { t } = useTranslation()
  const { mutate: sendMessage, isPending, isSuccess } = useContactForm()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(makeSchema(t)),
  })

  const onSubmit = (data: ContactFormData) => {
    sendMessage(data, { onSuccess: () => reset() })
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/25"
        >
          <CheckCircle size={36} className="text-white" />
        </motion.div>
        <h3 className="font-black text-gray-900 text-2xl mb-3">{t('contact.successTitle')}</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
          {t('contact.successMsg')}
        </p>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FloatingField label={t('contact.name')} icon={<User size={16} />} error={errors.name?.message}>
          <input placeholder={t('contact.namePlaceholder')} {...register('name')} className={inputClass} />
        </FloatingField>
        <FloatingField label={t('contact.email')} icon={<Mail size={16} />} error={errors.email?.message}>
          <input type="email" placeholder={t('contact.emailPlaceholder')} {...register('email')} className={inputClass} />
        </FloatingField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FloatingField label={t('contact.phone')} icon={<Phone size={16} />} error={errors.phone?.message}>
          <input type="tel" placeholder={t('contact.phonePlaceholder')} {...register('phone')} className={inputClass} />
        </FloatingField>
        <FloatingField label={t('contact.subject')} icon={<MessageSquare size={16} />} error={errors.subject?.message}>
          <input placeholder={t('contact.subjectPlaceholder')} {...register('subject')} className={inputClass} />
        </FloatingField>
      </div>

      <FloatingField label={t('contact.message')} icon={<AlignLeft size={16} />} error={errors.message?.message}>
        <textarea
          rows={5}
          placeholder={t('contact.messagePlaceholder')}
          {...register('message')}
          className={taClass}
          style={{ paddingTop: '16px' }}
        />
      </FloatingField>

      <motion.button
        type="submit"
        disabled={isPending}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden flex items-center justify-center gap-3 w-full bg-gray-900 text-white font-black py-4 px-8 rounded-2xl text-sm disabled:opacity-60 group"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

        <span className="relative flex items-center gap-3">
          {isPending ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              {t('contactForm.sending')}
            </>
          ) : (
            <>
              {t('contact.send')}
              <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </>
          )}
        </span>
      </motion.button>
    </motion.form>
  )
}

export default ContactForm