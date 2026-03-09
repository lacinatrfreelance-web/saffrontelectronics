import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import type { LoginCredentials } from '@/admin/types/admin.types'

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
})

// ── Animated orb background ──────────────────────────────────────────────────
const OrbBg: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const orbs = [
      { x: 0.15, y: 0.2,  r: 280, vx: 0.00015, vy: 0.0001,  hue: 38,  a: 0.12 },
      { x: 0.85, y: 0.75, r: 340, vx: -0.0001, vy: -0.00012, hue: 25,  a: 0.09 },
      { x: 0.5,  y: 0.5,  r: 220, vx: 0.00012, vy: 0.00014,  hue: 20,  a: 0.07 },
    ].map((o) => ({ ...o, px: o.x, py: o.y, t: Math.random() * Math.PI * 2 }))

    const tick = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      orbs.forEach((o: any) => {
        o.t += 0.008
        const cx = (o.x + Math.sin(o.t * 0.7) * 0.12) * w
        const cy = (o.y + Math.cos(o.t * 0.5) * 0.1) * h
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r)
        g.addColorStop(0, `hsla(${o.hue}, 88%, 58%, ${o.a})`)
        g.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(cx, cy, o.r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />
}

// ── Floating input field ──────────────────────────────────────────────────────
interface FloatFieldProps {
  label: string
  icon: React.ReactNode
  error?: string
  children: React.ReactNode
}

const FloatField: React.FC<FloatFieldProps> = ({ label, icon, error, children }) => (
  <div>
    <label className="block text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 mb-2">
      {label}
    </label>
    <div
      className={`relative flex items-center bg-gray-50 border-2 rounded-2xl transition-all duration-200 ${
        error
          ? 'border-red-300 bg-red-50/40'
          : 'border-transparent focus-within:border-orange-400 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(249,115,22,0.08)]'
      }`}
    >
      <span className="absolute left-4 text-gray-300 pointer-events-none transition-colors duration-200 peer-focus:text-orange-400">
        {icon}
      </span>
      {children}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-red-500 font-medium mt-1.5 ml-1"
      >
        {error}
      </motion.p>
    )}
  </div>
)

const inputCls =
  'peer w-full pl-11 pr-4 py-4 bg-transparent text-gray-900 text-sm font-medium placeholder-gray-300 outline-none rounded-2xl'

// ── Page ─────────────────────────────────────────────────────────────────────
export const AdminLoginPage: React.FC = () => {
  const { login, isLoggingIn } = useAdminAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(schema),
  })

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center p-4">

      {/* Orb canvas */}
      <OrbBg />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />

      {/* Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-orange-100/50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-orange-200/40 pointer-events-none" />

      {/* Brand watermark — top left */}
      <div className="absolute top-8 left-8 flex items-center gap-2.5 z-10">
        <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[11px] flex items-center justify-center shadow-md shadow-orange-400/30">
          <Zap size={17} className="text-white" fill="white" />
        </div>
        <div>
          <span className="font-black text-gray-900 text-base leading-none block tracking-tight">SAFFRON</span>
          <span className="text-[9px] text-orange-500 font-bold tracking-[0.22em] uppercase leading-none">Electronics CI</span>
        </div>
      </div>

      {/* Secure badge — top right */}
      <div className="absolute top-8 right-8 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full z-10">
        <ShieldCheck size={12} />
        Acces securise
      </div>

      {/* Card */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="bg-white/80 backdrop-blur-2xl border border-white/80 rounded-[28px] shadow-2xl shadow-gray-200/80 p-9">

          {/* ── Logo block ── */}
          <motion.div variants={fadeUp} className="text-center mb-9">
            {/* Animated icon */}
            <motion.div
              whileHover={{ rotate: 12, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 16 }}
              className="relative w-16 h-16 mx-auto mb-5"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[20px] flex items-center justify-center shadow-xl shadow-orange-400/35">
                <Zap size={28} className="text-white" fill="white" />
              </div>
              {/* Pulse ring */}
              <span
                className="absolute inset-0 rounded-[20px] ring-2 ring-orange-400/20 animate-ping"
                style={{ animationDuration: '2.8s' }}
              />
            </motion.div>

            <h1 className="font-black text-gray-900 text-2xl tracking-tight leading-none mb-1">
              Administration
            </h1>
            <p className="text-gray-400 text-sm font-medium">Saffron Electronics CI</p>
          </motion.div>

          {/* ── Divider ── */}
          <motion.div variants={fadeUp} className="relative mb-8">
            <div className="h-px bg-gray-100" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
              Connexion
            </span>
          </motion.div>

          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit((data) => login(data))}
            className="flex flex-col gap-4"
          >
            <motion.div variants={fadeUp}>
              <FloatField label="Adresse email" icon={<Mail size={16} />} error={errors.email?.message}>
                <input
                  type="email"
                  placeholder="admin@saffronelectronics.net"
                  autoComplete="email"
                  {...register('email')}
                  className={inputCls}
                />
              </FloatField>
            </motion.div>

            <motion.div variants={fadeUp}>
              <FloatField label="Mot de passe" icon={<Lock size={16} />} error={errors.password?.message}>
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                  className={inputCls}
                />
              </FloatField>
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeUp} className="mt-2">
              <motion.button
                type="submit"
                disabled={isLoggingIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden w-full flex items-center justify-center gap-3 bg-gray-900 text-white font-black py-4 px-6 rounded-2xl text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {/* Hover gradient */}
                <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-350" />
                {/* Shimmer */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <span className="relative flex items-center gap-3">
                  {isLoggingIn ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>
          </form>

          {/* ── Footer note ── */}
          <motion.p
            variants={fadeUp}
            className="text-center text-[11px] text-gray-300 font-medium mt-7"
          >
            Acces reserve aux administrateurs autorises
          </motion.p>
        </div>

        {/* Card bottom glow */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-orange-300/20 blur-xl rounded-full pointer-events-none" />
      </motion.div>
    </div>
  )
}

export default AdminLoginPage