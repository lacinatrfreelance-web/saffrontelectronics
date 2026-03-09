import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin, Clock, Facebook, Zap, ArrowUpRight, ChevronRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { COMPANY } from '@/utils/constants'

export const Footer: React.FC = () => {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const NAV_COL = [
    { to: '/',           labelKey: 'nav.home'        },
    { to: '/products',   labelKey: 'nav.products'    },
    { to: '/promotions', labelKey: 'nav.promotions'  },
    { to: '/about',      labelKey: 'nav.about'       },
    { to: '/contact',    labelKey: 'nav.contact'     },
  ]

  const HOURS = [
    { dayKey: 'footer.weekdays', hours: '8h00 — 19h00' },
    { dayKey: 'footer.sunday',   hours: '9h00 — 19h00' },
  ]

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }
  const itemVariants = {
    hidden:   { opacity: 0, y: 24 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <footer className="bg-gray-950 relative overflow-hidden">

      {/* Top decorative wave */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

      {/* Background circles */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-500/5 to-amber-400/5 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-amber-500/4 to-transparent blur-3xl pointer-events-none" />

      {/* Big CTA band */}
      <div className="border-b border-white/5">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="container-custom py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <motion.div variants={itemVariants} className="max-w-lg">
            <p className="text-xs font-bold text-orange-400 uppercase tracking-[0.2em] mb-3">
              {t('footer.ctaBadge')}
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              {t('footer.ctaTitleLine1')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                {t('footer.ctaTitleHighlight')}
              </span>
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
            <motion.a
              href={`tel:${COMPANY.phone}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow"
            >
              <Phone size={15} />
              {t('footer.callNow')}
            </motion.a>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white/8 border border-white/12 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl hover:bg-white/12 transition-colors"
              >
                {t('footer.writeUs')} <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Main grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="container-custom py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
      >
        {/* Brand */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[14px] flex items-center justify-center">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <div>
              <span className="font-black text-white text-lg tracking-tight">SAFFRON</span>
              <span className="block text-[9px] text-orange-400 font-bold tracking-[0.22em] uppercase">Electronics CI</span>
            </div>
          </Link>
          <p className="text-sm text-white/40 leading-relaxed mb-6">
            {t('footer.description')}
          </p>
          <a
            href={COMPANY.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-orange-400 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600/15 flex items-center justify-center group-hover:bg-blue-600/25 transition-colors">
              <Facebook size={14} className="text-blue-400" />
            </div>
            @saffronelectronics2016
            <ArrowUpRight size={11} className="opacity-40" />
          </a>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants}>
          <h4 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-6">
            {t('footer.navigation')}
          </h4>
          <ul className="flex flex-col gap-2.5">
            {NAV_COL.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="group flex items-center gap-2 text-sm text-white/45 hover:text-white transition-all duration-200"
                >
                  <ChevronRight size={12} className="text-orange-500/0 group-hover:text-orange-500 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  <span className="-translate-x-2 group-hover:translate-x-0 transition-transform duration-200">
                    {t(link.labelKey)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div variants={itemVariants}>
          <h4 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-6">
            {t('footer.contact')}
          </h4>
          <ul className="flex flex-col gap-4">
            <li>
              <a href={`tel:${COMPANY.phone}`} className="group flex items-center gap-3 text-sm text-white/45 hover:text-orange-400 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors shrink-0">
                  <Phone size={13} className="text-orange-400" />
                </div>
                {COMPANY.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="group flex items-center gap-3 text-sm text-white/45 hover:text-orange-400 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors shrink-0">
                  <Mail size={13} className="text-orange-400" />
                </div>
                {COMPANY.email}
              </a>
            </li>
            <li>
              <div className="flex items-start gap-3 text-sm text-white/35">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={13} className="text-orange-400" />
                </div>
                <span className="leading-relaxed">{COMPANY.address}</span>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Hours */}
        <motion.div variants={itemVariants}>
          <h4 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-6">
            {t('footer.hours')}
          </h4>
          <div className="space-y-3 mb-6">
            {HOURS.map(({ dayKey, hours }) => (
              <div key={dayKey} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Clock size={13} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/60">{t(dayKey)}</p>
                  <p className="text-xs text-white/30">{hours}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Live indicator */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs font-semibold text-emerald-400">{t('footer.openNow')}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/20">
            &copy; {year} Saffron Electronics CI — {t('footer.rights')}
          </p>
          <p className="text-xs text-white/15">Abidjan, {t('footer.country')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer