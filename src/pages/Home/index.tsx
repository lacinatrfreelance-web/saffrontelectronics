import React, { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Hero } from '@/components/sections/Hero'
import { CategoriesGrid } from '@/components/sections/CategoriesGrid'
import { FeaturedProducts } from '@/components/sections/FeaturedProducts'
import { PromoBanner } from '@/components/sections/PromoBanner'
import { WhyUs } from '@/components/sections/WhyUs'
import { useHomeData } from '@/hooks/useProducts'
import { usePageView } from '@/hooks/usePageView'
import { Phone, MapPin, Clock, ArrowRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { COMPANY } from '@/utils/constants'

// Floating particle background
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.25 + 0.05,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha})`
        ctx.fill()
      })
      animId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

// Animated counter
const Counter: React.FC<{ to: number; suffix?: string; duration?: number }> = ({ to, suffix = '', duration = 2 }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView || !ref.current) return
    let start = 0
    const end = to
    const step = end / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { start = end; clearInterval(timer) }
      if (ref.current) ref.current.textContent = Math.floor(start) + suffix
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, to, suffix, duration])

  return <span ref={ref}>0{suffix}</span>
}

export const HomePage: React.FC = () => {
  const { t } = useTranslation()
  const { data: homeData, isLoading } = useHomeData()
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' })

  usePageView('home')

  const STATS = [
    { value: 10,   suffix: '+', label: t('home.stats.experienceLabel'), sub: t('home.stats.experienceSub') },
    { value: 5000, suffix: '+', label: t('home.stats.clientsLabel'),    sub: t('home.stats.clientsSub')    },
    { value: 500,  suffix: '+', label: t('home.stats.productsLabel'),   sub: t('home.stats.productsSub')   },
    { value: 40,   suffix: '%', label: t('home.stats.promoLabel'),      sub: t('home.stats.promoSub')      },
  ]

  const contactItems = [
    {
      icon: Phone,
      label: t('home.contact.phoneLabel'),
      value: COMPANY.phone,
      href: `tel:${COMPANY.phone}`,
      color: 'orange',
    },
    {
      icon: Clock,
      label: t('home.contact.hoursLabel'),
      value: t('home.contact.hoursValue'),
      href: null,
      color: 'emerald',
    },
    {
      icon: MapPin,
      label: t('home.contact.showroomLabel'),
      value: t('home.contact.showroomValue'),
      href: null,
      color: 'blue',
    },
  ]

  const colorMap: Record<string, string> = {
    orange: 'bg-orange-50 border-orange-100 text-orange-500',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-500',
    blue: 'bg-blue-50 border-blue-100 text-blue-500',
  }

  return (
    <>
      <Helmet>
        <title>{t('home.meta.title')}</title>
        <meta name="description" content={t('home.meta.description')} />
      </Helmet>

      <Hero />
      <CategoriesGrid />

      {homeData?.current_promotion && <PromoBanner promotion={homeData.current_promotion} />}

      {/* Animated Stats section */}
      <section className="py-20 bg-gray-950 relative overflow-hidden" ref={statsRef}>
        <ParticleField />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-black text-orange-400 uppercase tracking-[0.25em] mb-3">
              {t('home.stats.sectionBadge')}
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              {t('home.stats.sectionTitleLine1')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                {t('home.stats.sectionTitleHighlight')}
              </span>
              {' '}{t('home.stats.sectionTitleLine2')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={statsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative overflow-hidden bg-white/5 border border-white/8 rounded-3xl p-7 cursor-default"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 to-amber-400/4 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl" />
                <div className="relative z-10">
                  <div className="text-5xl font-black text-white mb-2 leading-none">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm font-bold text-orange-400 mb-1">{stat.label}</p>
                  <p className="text-xs text-white/30">{stat.sub}</p>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-500/15 to-transparent rounded-bl-3xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProducts
        title={t('featured.title')}
        subtitle={t('featured.subtitle')}
        products={homeData?.featured_products || []}
        isLoading={isLoading}
        viewAllLink="/products?is_featured=true"
        viewAllLabel={t('featured.viewAll')}
      />

      <FeaturedProducts
        title={t('featured.newTitle')}
        subtitle={t('featured.newSubtitle')}
        products={homeData?.new_products || []}
        isLoading={isLoading}
        viewAllLink="/products?is_new=true"
        viewAllLabel={t('featured.viewAllNew')}
      />

      <WhyUs />

      {/* Contact rapide */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-2">
                {t('home.contact.sectionBadge')}
              </p>
              <h2 className="text-3xl font-black text-gray-900">
                {t('home.contact.sectionTitle')}
              </h2>
            </div>
            <a
              href={`tel:${COMPANY.phone}`}
              className="group inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-orange-500 transition-colors"
            >
              {t('home.contact.callLink')}
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {contactItems.map(({ icon: Icon, label, value, href, color }, i) => {
              const cardClass = `group relative overflow-hidden rounded-3xl p-7 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${colorMap[color]}`
              const inner = (
                <>
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20"
                    style={{ background: 'radial-gradient(circle at top right, currentColor, transparent)' }}
                  />
                  <Icon size={24} className="mb-5 relative z-10" />
                  <p className="text-xs font-black uppercase tracking-[0.18em] opacity-60 mb-1.5 relative z-10">{label}</p>
                  <p className="font-bold text-gray-900 text-sm leading-snug relative z-10">{value}</p>
                </>
              )
              return href ? (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cardClass}
                >
                  {inner}
                </motion.a>
              ) : (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cardClass}
                >
                  {inner}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage