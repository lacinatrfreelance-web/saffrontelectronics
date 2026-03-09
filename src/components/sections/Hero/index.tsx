import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Zap, ShieldCheck, Star,
  Wind, Thermometer, Tv, Shirt, MapPin,
} from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { getImageUrl } from '@/utils/formatters'

// ─── Animated orb canvas ─────────────────────────────────────────────────────
const OrbCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const orbs = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: 80 + Math.random() * 130, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      hue: [38, 25, 20, 45, 15, 35, 30][i], alpha: 0.035 + Math.random() * 0.055,
    }))
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      orbs.forEach((o) => {
        o.x += o.vx; o.y += o.vy
        if (o.x < -o.r) o.x = canvas.width + o.r
        if (o.x > canvas.width + o.r) o.x = -o.r
        if (o.y < -o.r) o.y = canvas.height + o.r
        if (o.y > canvas.height + o.r) o.y = -o.r
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        g.addColorStop(0, `hsla(${o.hue}, 90%, 58%, ${o.alpha})`)
        g.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.fill()
      })
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />
}

// ─── Category icon fallback ───────────────────────────────────────────────────
function getCategoryIcon(name: string) {
  const l = name.toLowerCase()
  if (l.includes('clim')) return Wind
  if (l.includes('refrig') || l.includes('frigo')) return Thermometer
  if (l.includes('tv') || l.includes('telev')) return Tv
  if (l.includes('lave') || l.includes('machine')) return Shirt
  return Zap
}

const CARD_COLORS = [
  { bg: 'from-sky-400 to-blue-500',      shadow: 'rgba(56,189,248,0.35)' },
  { bg: 'from-emerald-400 to-teal-500',  shadow: 'rgba(52,211,153,0.35)' },
  { bg: 'from-violet-400 to-purple-500', shadow: 'rgba(167,139,250,0.35)' },
  { bg: 'from-rose-400 to-pink-500',     shadow: 'rgba(251,113,133,0.35)' },
]

const CategoryCardImage: React.FC<{ image: string | null; name: string; color: { bg: string; shadow: string } }> = ({ image, name, color }) => {
  const [broken, setBroken] = useState(false)
  const url = image ? getImageUrl(image) : null
  const Icon = getCategoryIcon(name)
  return (
    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden`} style={{ boxShadow: `0 8px 20px ${color.shadow}` }}>
      {url && !broken ? <img src={url} alt={name} className="w-full h-full object-cover" onError={() => setBroken(true)} /> : <Icon size={22} className="text-white" />}
    </div>
  )
}

const CategoryCard: React.FC<{ category: any; colorIndex: number; floatDelay: number; isHighlighted: boolean }> = ({ category, colorIndex, floatDelay, isHighlighted }) => {
  const color = CARD_COLORS[colorIndex % CARD_COLORS.length]
  return (
    <motion.div animate={{ y: [0, -9, 0] }} transition={{ duration: 3.8 + floatDelay * 0.65, repeat: Infinity, ease: 'easeInOut', delay: floatDelay * 0.55 }}>
      <motion.div whileHover={{ scale: 1.06, rotate: 1.5 }} transition={{ type: 'spring', stiffness: 380, damping: 20 }} className="relative bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-200/70 cursor-pointer group overflow-hidden">
        <AnimatePresence>
          {isHighlighted && (
            <motion.div key="flash" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.18, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className={`absolute inset-0 bg-gradient-to-br ${color.bg} rounded-3xl pointer-events-none`} />
          )}
        </AnimatePresence>
        {isHighlighted && <motion.div initial={{ opacity: 0.6, scale: 1 }} animate={{ opacity: 0, scale: 1.18 }} transition={{ duration: 0.9, ease: 'easeOut' }} className={`absolute inset-0 rounded-3xl border-2 bg-gradient-to-br ${color.bg} opacity-20 pointer-events-none`} />}
        <CategoryCardImage image={category.image} name={category.name} color={color} />
        <p className="font-black text-gray-900 text-sm leading-tight">{category.name}</p>
        {category.products_count !== undefined && <p className="text-xs text-gray-400 mt-1 font-medium">{category.products_count} produit{category.products_count !== 1 ? 's' : ''}</p>}
        <div className={`mt-3 h-0.5 rounded-full bg-gradient-to-r ${color.bg} w-0 group-hover:w-full transition-all duration-400`} />
      </motion.div>
    </motion.div>
  )
}

// ─── Animated word cycler ─────────────────────────────────────────────────────
const CYCLING_WORDS = ['performant', 'garanti', 'livré', 'accessible']

const WordCycler: React.FC = () => {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % CYCLING_WORDS.length), 2200)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="relative inline-block overflow-hidden" style={{ minWidth: '11rem' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 40, opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0,  opacity: 1, filter: 'blur(0px)' }}
          exit={{   y: -40, opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-block text-transparent bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(135deg,#FBBF24 0%,#F97316 55%,#EF4444 100%)' }}
        >
          {CYCLING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// ─── Stagger variants ─────────────────────────────────────────────────────────
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.13 } } }
const fadeUp  = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } } }

// ─── Hero ─────────────────────────────────────────────────────────────────────
export const Hero: React.FC = () => {
  const { data: categories, isLoading } = useCategories()
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!categories?.length) return
    const count = Math.min(categories.length, 4)
    let current = 0
    const cycle = () => { setHighlightedIndex(current); current = (current + 1) % count }
    cycle()
    const id = setInterval(cycle, 1800)
    return () => clearInterval(id)
  }, [categories])

  const displayedCategories = categories?.slice(0, 4) ?? []

  return (
    <section className="relative bg-white overflow-hidden min-h-screen flex items-center">
      <OrbCanvas />

      <div className="absolute inset-0 pointer-events-none opacity-[0.032]" style={{ backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)', backgroundSize: '38px 38px' }} />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] rounded-full border border-orange-100/50 pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[580px] h-[580px] rounded-full border border-orange-200/40 pointer-events-none" />

      <div className="container-custom relative z-10 py-28 lg:py-0 lg:min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* ── LEFT ── */}
          <motion.div variants={stagger} initial="hidden" animate="visible">

            {/* Social proof — avatars + étoiles + localisation */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-10">
              {/* Fake avatars */}
              <div className="flex -space-x-2.5 shrink-0">
                {['#F97316','#FBBF24','#34D399','#818CF8','#FB7185'].map((bg, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-black" style={{ backgroundColor: bg, zIndex: 5 - i }}>
                    {['A','K','S','M','F'][i]}
                  </div>
                ))}
              </div>
              {/* Divider */}
              <div className="w-px h-8 bg-gray-200 shrink-0" />
              {/* Stars + text */}
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} className="text-amber-400 fill-amber-400" />)}
                  <span className="text-xs font-black text-gray-800 ml-1.5">4.9</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                  <MapPin size={10} className="text-orange-400 shrink-0" />
                  +5 000 clients satisfaits · Abidjan
                </div>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeUp} className="mb-8">
              {/* Eyebrow tag */}
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-3.5 py-1.5 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs font-black text-orange-600 uppercase tracking-widest">N°1 à Abidjan</span>
              </div>

              <h1
                className="font-black text-gray-900 leading-[1.05]"
                style={{ fontSize: 'clamp(2.8rem, 5.2vw, 4.6rem)' }}
              >
                {/* Line 1 — static */}
                <span className="block">L'électro-</span>

                {/* Line 2 — gradient animé */}
                <span
                  className="block text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg,#FBBF24 0%,#F97316 55%,#EF4444 100%)' }}
                >
                  ménager
                </span>

                {/* Line 3 — mot cyclique */}
                <span className="block text-[0.72em] text-gray-400 font-extrabold tracking-tight mt-1">
                  toujours{' '}
                  <WordCycler />
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p variants={fadeUp} className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
              Réfrigérateurs, climatiseurs, télévisions et bien plus —{' '}
              <span className="text-gray-600 font-semibold">garantie constructeur</span> et promotions jusqu'à{' '}
              <span className="font-black text-orange-500 relative">
                40% de remise
                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-orange-300/60 rounded-full" />
              </span>.
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-14">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/products" className="group relative overflow-hidden inline-flex items-center gap-2.5 bg-gray-900 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-xl shadow-gray-900/20">
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-350" />
                  <span className="relative">Voir les produits</span>
                  <ArrowRight size={16} className="relative group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/promotions" className="inline-flex items-center gap-2.5 bg-orange-50 border-2 border-orange-100 hover:border-orange-300 text-orange-600 font-black text-sm px-8 py-4 rounded-2xl transition-all duration-200">
                  <Zap size={16} className="fill-orange-500" />
                  Promotions en cours
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex items-center gap-8">
              {[{ value: '10+', label: "Ans d'exp." }, { value: '500+', label: 'Produits' }, { value: '40%', label: 'Remise max' }].map(({ value, label }, i) => (
                <React.Fragment key={label}>
                  <div>
                    <div className="text-3xl font-black text-gray-900 leading-none">{value}</div>
                    <div className="text-xs text-gray-400 mt-1 font-medium">{label}</div>
                  </div>
                  {i < 2 && <div className="w-px h-10 bg-gray-200" />}
                </React.Fragment>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT ── */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-amber-300/18 to-orange-400/12 blur-2xl pointer-events-none" />

            {!isLoading && displayedCategories.length > 0 && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                {displayedCategories.map((_, i) => (
                  <motion.div key={i} animate={{ width: highlightedIndex === i ? 24 : 6, backgroundColor: highlightedIndex === i ? '#f97316' : '#e5e7eb' }} transition={{ duration: 0.4 }} className="h-1.5 rounded-full" />
                ))}
              </div>
            )}

            <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.45 } } }} className="grid grid-cols-2 gap-4 relative z-10">
              {isLoading
                ? [...Array(4)].map((_, i) => (
                    <motion.div key={i} variants={{ hidden: { opacity: 0, scale: 0.78, y: 24 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.65, ease: [0.34, 1.56, 0.64, 1] } } }}>
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl animate-pulse">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 mb-4" />
                        <div className="h-3.5 bg-gray-100 rounded-full w-3/4 mb-2" />
                        <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
                      </div>
                    </motion.div>
                  ))
                : displayedCategories.map((cat, i) => (
                    <motion.div key={cat.id} variants={{ hidden: { opacity: 0, scale: 0.78, y: 24 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.65, ease: [0.34, 1.56, 0.64, 1] } } }}>
                      <Link to={`/products?category=${cat.slug}`}>
                        <CategoryCard category={cat} colorIndex={i} floatDelay={i} isHighlighted={highlightedIndex === i} />
                      </Link>
                    </motion.div>
                  ))
              }
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -16, x: 16 }} animate={{ opacity: 1, y: 0, x: 0 }} transition={{ delay: 1.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }} className="absolute -top-5 -right-5 flex items-center gap-2 bg-emerald-500 text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-xl shadow-emerald-500/30 z-20">
              <ShieldCheck size={14} />
              Garantie constructeur
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16, x: -16 }} animate={{ opacity: 1, y: 0, x: 0 }} transition={{ delay: 1.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }} className="absolute -bottom-5 -left-5 flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-xl shadow-orange-500/30 z-20">
              <Zap size={13} fill="white" />
              Jusqu'a -40% de remise
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
    </section>
  )
}

export default Hero