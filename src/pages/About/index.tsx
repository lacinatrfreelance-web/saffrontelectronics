import React, { useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Award, Users, MapPin, Calendar, ShieldCheck, Star,
  Clock, TrendingDown, ArrowRight, Sparkles,
  CheckCircle2, Phone,
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

// ─── Page ─────────────────────────────────────────────────────────────────────

export const AboutPage: React.FC = () => {
  const { t } = useTranslation()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  // ─── Data (driven by translations) ───────────────────────────────────────

  const STATS = [
    { icon: Calendar,    value: '10+',  labelKey: 'about.experience', color: 'from-amber-400 to-orange-500',  glow: 'rgba(251,191,36,0.25)'  },
    { icon: Users,       value: '5k+',  labelKey: 'about.clients',    color: 'from-blue-400 to-indigo-500',   glow: 'rgba(96,165,250,0.25)'  },
    { icon: Award,       value: '500+', labelKey: 'about.catalog',    color: 'from-emerald-400 to-teal-500',  glow: 'rgba(52,211,153,0.25)'  },
    { icon: MapPin,      value: '1',    labelKey: 'about.showroom',   color: 'from-rose-400 to-pink-500',     glow: 'rgba(251,113,133,0.25)' },
  ]

  const VALUES = [
    {
      icon: ShieldCheck,
      titleKey: 'about.quality.title',
      descKey:  'about.quality.desc',
      tagKey:   'about.quality.tag',
      accent: '#F59E0B',
    },
    {
      icon: Star,
      titleKey: 'about.trust.title',
      descKey:  'about.trust.desc',
      tagKey:   'about.trust.tag',
      accent: '#3B82F6',
    },
    {
      icon: Clock,
      titleKey: 'about.service.title',
      descKey:  'about.service.desc',
      tagKey:   'about.service.tag',
      accent: '#10B981',
    },
    {
      icon: TrendingDown,
      titleKey: 'about.price.title',
      descKey:  'about.price.desc',
      tagKey:   'about.price.tag',
      accent: '#8B5CF6',
    },
  ]

  const TIMELINE = [
    { year: '2013', titleKey: 'about.timeline.2013.title', textKey: 'about.timeline.2013.text' },
    { year: '2016', titleKey: 'about.timeline.2016.title', textKey: 'about.timeline.2016.text' },
    { year: '2019', titleKey: 'about.timeline.2019.title', textKey: 'about.timeline.2019.text' },
    { year: '2024', titleKey: 'about.timeline.2024.title', textKey: 'about.timeline.2024.text' },
  ]

  const CHECK_ITEMS = [
    'about.checkGuarantee',
    'about.checkOriginal',
    'about.checkDelivery',
    'about.checkAfterSales',
  ]

  const MOSAIC = [
    { text: '10+',  subKey: 'about.yearsExp',    bg: 'linear-gradient(135deg,#FBBF24,#F97316)', textColor: 'white',    mt: ''       },
    { text: '40%',  subKey: 'about.maxDiscount', bg: '#111',                                     textColor: 'white',    mt: 'mt-8'   },
    { text: '7j/7', subKey: 'about.open',        bg: 'white',                                    textColor: '#F97316',  mt: '-mt-4', border: true },
    { text: '100%', subKey: 'about.original',    bg: 'linear-gradient(135deg,#10B981,#059669)', textColor: 'white',    mt: ''       },
  ]

  return (
    <>
      <Helmet>
        <title>{t('about.meta.title')}</title>
        <meta name="description" content={t('about.meta.description')} />
      </Helmet>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-[#0A0A0A]">

        {/* Noise texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: '200px 200px' }}
        />

        {/* Glows */}
        <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)' }}
        />
        <motion.div animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
        />

        {/* Fine grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '72px 72px' }}
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container-custom relative z-10 pt-36 pb-24">
          <div className="max-w-4xl">

            {/* Eyebrow */}
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
              className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8"
            >
              <Sparkles size={12} className="text-orange-400" />
              <span className="text-xs font-black text-white/60 uppercase tracking-[0.2em]">{t('about.badge')}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-black text-white leading-[1.0] mb-8"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
            >
              {t('about.heroLine1')}<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #FBBF24 0%, #F97316 50%, #EF4444 100%)' }}>
                {t('about.heroHighlight')}
              </span>
              <br />
              <span className="text-white/25">{t('about.heroLine3')}</span>
            </motion.h1>

            {/* Lead */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7 }}
              className="text-white/40 text-xl leading-relaxed max-w-2xl mb-12"
            >
              {t('about.heroSubtitle.before')}
              <span className="text-white/70 font-semibold"> {t('about.heroSubtitle.quality')} </span>
              {t('about.heroSubtitle.and1')}
              <span className="text-white/70 font-semibold"> {t('about.heroSubtitle.trust')} </span>
              {t('about.heroSubtitle.and2')}
              <span className="text-white/70 font-semibold"> {t('about.heroSubtitle.service')} </span>.
            </motion.p>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/products"
                className="group relative overflow-hidden inline-flex items-center gap-2.5 font-black text-sm px-7 py-4 rounded-2xl text-white shadow-xl"
                style={{ background: 'linear-gradient(135deg, #F97316, #EF4444)' }}
              >
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                <span className="relative">{t('about.ctaProducts')}</span>
                <ArrowRight size={15} className="relative group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact"
                className="inline-flex items-center gap-2.5 font-black text-sm px-7 py-4 rounded-2xl bg-white/6 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Phone size={14} />
                {t('nav.contactUs')}
              </Link>
            </motion.div>

            {/* Scroll hint */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
              className="flex items-center gap-3 mt-20"
            >
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-5 h-9 rounded-full border-2 border-white/15 flex items-start justify-center pt-1.5"
              >
                <div className="w-1 h-2.5 rounded-full bg-gradient-to-b from-orange-400 to-orange-600" />
              </motion.div>
              <span className="text-[10px] text-white/20 uppercase tracking-[0.2em]">{t('about.scrollHint')}</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-white py-20 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map((stat, i) => (
              <motion.div key={stat.labelKey} {...fadeUp(i * 0.1)}
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative overflow-hidden rounded-3xl p-8 bg-gray-50 border border-gray-100 group cursor-default"
                style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${stat.glow}, transparent 70%)` }}
                />
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  style={{ boxShadow: `0 8px 24px ${stat.glow}` }}
                >
                  <stat.icon size={20} className="text-white" />
                </div>
                <div className="relative text-5xl font-black text-gray-900 leading-none mb-2">{stat.value}</div>
                <p className="relative text-sm text-gray-400 font-medium leading-snug">{t(stat.labelKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ─────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-gray-50 overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-24 items-center">

            {/* Text */}
            <div>
              <motion.p {...fadeUp(0)} className="text-xs font-black text-orange-500 uppercase tracking-[0.22em] mb-4">{t('about.whoWeAre')}</motion.p>
              <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
                {t('about.partnerTitleLine1')}<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#FBBF24,#F97316)' }}>
                  {t('about.partnerTitleHighlight')}
                </span>
              </motion.h2>

              <div className="flex flex-col gap-5">
                {(['about.p1', 'about.p2', 'about.p3'] as const).map((key, i) => (
                  <motion.p key={key} {...fadeUp(0.15 + i * 0.1)} className="text-gray-500 leading-relaxed text-[15px]">
                    {t(key)}
                  </motion.p>
                ))}
              </div>

              {/* Checklist */}
              <motion.div {...fadeUp(0.5)} className="grid grid-cols-2 gap-3 mt-8">
                {CHECK_ITEMS.map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold text-gray-600">{t(key)}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div {...fadeUp(0.6)} className="mt-10">
                <Link to="/contact" className="group inline-flex items-center gap-2.5 bg-gray-900 hover:bg-orange-500 text-white font-black text-sm px-7 py-4 rounded-2xl transition-colors duration-300 shadow-lg shadow-gray-900/20">
                  {t('nav.contactUs')}
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Visual mosaic */}
            <div className="grid grid-cols-2 gap-4">
              {MOSAIC.map(({ text, subKey, bg, textColor, mt, border }, i) => (
                <motion.div key={text}
                  initial={{ opacity: 0, scale: 0.82 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.05, rotate: 1.5 }}
                  className={`rounded-3xl p-8 text-center flex flex-col items-center justify-center aspect-square ${mt} ${border ? 'border border-gray-200' : ''}`}
                  style={{ background: bg }}
                >
                  <div className="text-5xl font-black mb-2 leading-none" style={{ color: textColor }}>{text}</div>
                  <div className="text-xs font-bold uppercase tracking-wide opacity-60" style={{ color: textColor }}>{t(subKey)}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white overflow-hidden">
        <div className="container-custom">
          <motion.div {...fadeUp()} className="mb-16">
            <p className="text-xs font-black text-orange-500 uppercase tracking-[0.22em] mb-3">{t('about.timelineBadge')}</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              {t('about.timelineTitleLine1')}<br />
              <span className="text-gray-300">{t('about.timelineTitleLine2')}</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-300 via-orange-200 to-transparent md:-translate-x-px" />
            <div className="flex flex-col gap-12">
              {TIMELINE.map((item, i) => (
                <motion.div key={item.year} {...fadeUp(i * 0.15)}
                  className={`relative flex gap-8 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 pl-12 md:pl-0 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <motion.div whileHover={{ y: -4 }}
                      className="inline-block bg-gray-50 border border-gray-100 rounded-2xl p-6 max-w-sm"
                    >
                      <div className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2">{item.year}</div>
                      <div className="font-black text-gray-900 text-lg mb-2">{t(item.titleKey)}</div>
                      <p className="text-gray-400 text-sm leading-relaxed">{t(item.textKey)}</p>
                    </motion.div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-6 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.2, type: 'spring', stiffness: 400 }}
                      className="w-9 h-9 rounded-full bg-white border-2 border-orange-300 flex items-center justify-center shadow-lg shadow-orange-100"
                    >
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />
                    </motion.div>
                  </div>
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────────────── */}
      <section className="py-28 overflow-hidden" style={{ background: 'linear-gradient(160deg, #0A0A0A 0%, #111 100%)' }}>
        <div className="container-custom">
          <motion.div {...fadeUp()} className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs font-black text-orange-400 uppercase tracking-[0.22em] mb-3">{t('about.valuesBadge')}</p>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">{t('about.valuesTitle')}</h2>
            </div>
            <p className="text-white/30 text-base max-w-sm leading-relaxed">{t('about.valuesSubtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VALUES.map((value, i) => (
              <motion.div key={value.titleKey}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl p-8 cursor-default border"
                style={{ background: `${value.accent}08`, borderColor: `${value.accent}18` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${value.accent}25, transparent)` }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full"
                  style={{ background: `linear-gradient(90deg, ${value.accent}, transparent)` }}
                />
                <div className="absolute top-6 right-6 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border"
                  style={{ color: value.accent, borderColor: `${value.accent}30`, background: `${value.accent}12` }}
                >
                  {t(value.tagKey)}
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${value.accent}15`, border: `1.5px solid ${value.accent}30` }}
                >
                  <value.icon size={20} style={{ color: value.accent }} />
                </div>
                <h3 className="font-black text-white text-xl mb-3">{t(value.titleKey)}</h3>
                <p className="text-white/35 text-sm leading-relaxed group-hover:text-white/50 transition-colors duration-300">{t(value.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ──────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="container-custom relative z-10 text-center">
          <motion.div {...fadeUp()}>
            <p className="text-xs font-black text-orange-500 uppercase tracking-[0.22em] mb-4">{t('about.ctaBadge')}</p>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
              {t('about.ctaTitleLine1')}<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#FBBF24,#F97316,#EF4444)' }}>
                {t('about.ctaTitleHighlight')}
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">{t('about.ctaSubtitle')}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/products" className="group relative overflow-hidden inline-flex items-center gap-2.5 font-black text-sm px-8 py-4 rounded-2xl text-white shadow-xl"
                style={{ background: 'linear-gradient(135deg,#F97316,#EF4444)' }}
              >
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition duration-300" />
                <span className="relative">{t('about.ctaProducts')}</span>
                <ArrowRight size={15} className="relative group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2.5 font-black text-sm px-8 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors duration-200">
                <MapPin size={14} className="text-orange-500" />
                {t('about.ctaFind')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default AboutPage