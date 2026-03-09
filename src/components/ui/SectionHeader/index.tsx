import React from 'react'
import { motion } from 'framer-motion'

interface SectionHeaderProps {
  label?: string       // small eyebrow text
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  subtitle,
  centered = false,
  light = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={centered ? 'text-center' : ''}
    >
      {/* Eyebrow label */}
      {label && (
        <p className={`text-[10px] font-black uppercase tracking-[0.22em] mb-3 ${
          light ? 'text-orange-400' : 'text-orange-500'
        }`}>
          {label}
        </p>
      )}

      {/* Title */}
      <h2 className={`font-black text-3xl lg:text-4xl leading-tight ${
        light ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h2>

      {/* Animated gradient accent bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`mt-4 h-1 w-14 rounded-full origin-left ${centered ? 'mx-auto' : ''}`}
        style={{
          background: light
            ? 'rgba(255,255,255,0.35)'
            : 'linear-gradient(90deg, #FBBF24, #F97316)',
          transformOrigin: centered ? 'center' : 'left',
        }}
      />

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`mt-3 text-base lg:text-lg leading-relaxed ${
            light ? 'text-white/45' : 'text-gray-400'
          } ${centered ? '' : 'max-w-xl'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}

export default SectionHeader