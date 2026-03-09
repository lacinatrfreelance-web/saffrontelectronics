import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ArrowRight, Clock, Flame } from 'lucide-react'
import type { Promotion } from '@/types/product.types'
import { getCountdown } from '@/utils/formatters'

interface PromoBannerProps {
  promotion: Promotion
}

// Animated flip digit unit
const Digit: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const str = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[58px] h-[62px] md:w-[70px] md:h-[74px]">
        {/* Card background */}
        <div className="absolute inset-0 bg-white/15 border border-white/25 rounded-2xl backdrop-blur-sm shadow-inner" />
        {/* Horizontal fold line */}
        <div className="absolute left-3 right-3 top-1/2 -translate-y-px h-px bg-black/12 z-10" />
        {/* Animated number */}
        <AnimatePresence mode="wait">
          <motion.span
            key={str}
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl font-black text-white tabular-nums tracking-tight"
          >
            {str}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{label}</span>
    </div>
  )
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ promotion }) => {
  const [countdown, setCountdown] = useState(getCountdown(promotion.end_date))

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getCountdown(promotion.end_date)), 1000)
    return () => clearInterval(interval)
  }, [promotion.end_date])

  if (countdown.expired) return null

  return (
    <section className="relative overflow-hidden py-16">

      {/* Rich warm gradient — NOT dark */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 50%, #EF4444 100%)' }}
      />

      {/* Animated decorative blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-36 -right-36 w-96 h-96 rounded-full bg-white/10 pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1.15, 1, 1.15], rotate: [6, 0, 6] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-36 -left-36 w-[420px] h-[420px] rounded-full bg-white/8 pointer-events-none"
      />

      {/* Diagonal light streaks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-white/10"
            style={{ width: '200%', top: `${15 + i * 16}%`, left: '-50%', transform: 'rotate(-14deg)' }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* ── LEFT — text ── */}
          <div className="text-center lg:text-left max-w-xl">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-5"
            >
              <Flame size={12} fill="white" />
              Offre limitee
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.65 }}
              className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4"
            >
              {promotion.title}
            </motion.h2>

            {promotion.description && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/75 text-lg mb-6 leading-relaxed"
              >
                {promotion.description}
              </motion.p>
            )}

            {/* Discount chip */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28, type: 'spring', stiffness: 260, damping: 18 }}
              className="inline-flex items-center gap-3 bg-white text-orange-600 font-black text-2xl px-7 py-3.5 rounded-2xl shadow-2xl shadow-black/25 mb-7"
            >
              <Zap size={22} className="fill-orange-500 text-orange-500" />
              -{promotion.discount_percentage}% DE REMISE
            </motion.div>

            {/* CTA */}
            <div className="block">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/promotions"
                  className="inline-flex items-center gap-2.5 bg-white/15 hover:bg-white/28 border border-white/30 text-white font-black text-sm px-7 py-3.5 rounded-2xl transition-all duration-200"
                >
                  Voir toutes les offres
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* ── RIGHT — countdown ── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-2 text-white/60 text-sm font-semibold mb-6">
              <Clock size={14} />
              <span>Fin de l'offre dans</span>
            </div>

            <div className="flex items-end gap-2">
              <Digit value={countdown.days} label="Jours" />
              <span className="text-white/35 font-black text-3xl pb-9">:</span>
              <Digit value={countdown.hours} label="Heures" />
              <span className="text-white/35 font-black text-3xl pb-9">:</span>
              <Digit value={countdown.minutes} label="Min" />
              <span className="text-white/35 font-black text-3xl pb-9">:</span>
              <Digit value={countdown.seconds} label="Sec" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PromoBanner