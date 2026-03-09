import React, { useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Phone, Mail, MapPin, Clock, Facebook, ArrowUpRight, Send } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { ContactForm } from '@/components/sections/ContactForm'
import { COMPANY } from '@/utils/constants'

const CONTACT_CARDS = [
  {
    icon: Phone,
    label: 'Telephone',
    value: COMPANY.phone,
    sub: 'Reponse immediate',
    href: `tel:${COMPANY.phone}`,
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-600',
  },
  {
    icon: Mail,
    label: 'Email',
    value: COMPANY.email,
    sub: 'Reponse sous 24h',
    href: `mailto:${COMPANY.email}`,
    gradient: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    text: 'text-blue-600',
  },
  {
    icon: MapPin,
    label: 'Showroom',
    value: 'Riviera Palmeraie',
    sub: COMPANY.address,
    href: null,
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-600',
  },
  {
    icon: Clock,
    label: 'Horaires',
    value: 'Lun–Sam 8h–19h',
    sub: 'Dimanche 9h–19h',
    href: null,
    gradient: 'from-rose-400 to-pink-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    text: 'text-rose-600',
  },
]

export const ContactPage: React.FC = () => {
  const cardsRef = useRef<HTMLDivElement>(null)
  const cardsInView = useInView(cardsRef, { once: true, margin: '-60px' })

  return (
    <>
      <Helmet>
        <title>Contact — Saffron Electronics CI</title>
        <meta name="description" content="Contactez Saffron Electronics a Abidjan. Telephone, email, formulaire de contact et adresse du showroom." />
      </Helmet>

      {/* Hero — split layout */}
      <section className="min-h-[55vh] bg-gray-950 flex items-end relative overflow-hidden pt-28 pb-16">
        {/* Animated background blobs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-radial from-orange-500/12 to-transparent rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-0 left-20 w-[300px] h-[300px] bg-gradient-radial from-blue-500/8 to-transparent rounded-full blur-3xl pointer-events-none"
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-xs font-black text-orange-400 uppercase tracking-[0.25em] mb-5">
              On vous ecoute
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-6">
              Parlons de<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500">
                votre projet
              </span>
            </h1>
            <p className="text-white/35 text-lg max-w-md">
              Notre equipe est disponible pour repondre a toutes vos questions, 7 jours sur 7.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-white py-16" ref={cardsRef}>
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTACT_CARDS.map(({ icon: Icon, label, value, sub, href, gradient, bg, border, text }, i) => {
              const card = (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.55 }}
                  whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
                  className={`relative overflow-hidden rounded-3xl p-7 ${bg} border ${border} group transition-all duration-300 ${href ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {/* Gradient bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />

                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    style={{ boxShadow: `0 8px 20px ${gradient.includes('amber') ? 'rgba(251,191,36,0.3)' : 'rgba(0,0,0,0.1)'}` }}>
                    <Icon size={20} className="text-white" />
                  </div>

                  <p className={`text-xs font-black uppercase tracking-[0.15em] mb-1.5 ${text} opacity-70`}>{label}</p>
                  <p className="font-black text-gray-900 text-sm mb-0.5 leading-snug">{value}</p>
                  <p className="text-xs text-gray-400">{sub}</p>

                  {href && (
                    <div className={`absolute top-5 right-5 w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      <ArrowUpRight size={13} className="text-white" />
                    </div>
                  )}
                </motion.div>
              )

              return href ? <a key={label} href={href}>{card}</a> : <div key={label}>{card}</div>
            })}
          </div>
        </div>
      </section>

      {/* Form + Facebook */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Form — takes more space */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-3">Message</p>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Ecrivez-nous</h2>
                <p className="text-gray-400 text-sm mb-8">Nous vous repondrons dans les meilleurs delais.</p>
              </motion.div>
              <ContactForm />
            </div>

            {/* Side info */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl overflow-hidden h-52 bg-gray-200 flex-shrink-0 border border-gray-200"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.985!2d-3.9571!3d5.3792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjInNDUuMSJOIDPCsDU3JzI1LjYiVw!5e0!3m2!1sfr!2sci!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Saffron Electronics"
                />
              </motion.div>

              {/* Facebook card */}
              <motion.a
                href={COMPANY.facebook}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group flex items-center gap-5 bg-[#1877F2] rounded-3xl p-6 text-white no-underline"
              >
                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                  <Facebook size={26} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] opacity-70 mb-1">Suivez-nous</p>
                  <p className="font-black text-lg leading-tight">@saffronelectronics2016</p>
                </div>
                <ArrowUpRight size={18} className="opacity-40 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </motion.a>

              {/* Hours card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white border border-gray-100 rounded-3xl p-6"
              >
                <div className="flex items-center gap-2 mb-5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                  </span>
                  <span className="text-sm font-bold text-emerald-500">Ouvert maintenant</span>
                </div>
                <div className="space-y-3">
                  {[
                    { day: 'Lundi — Samedi', hours: '8h00 — 19h00' },
                    { day: 'Dimanche', hours: '9h00 — 19h00' },
                  ].map(({ day, hours }) => (
                    <div key={day} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{day}</span>
                      <span className="font-bold text-gray-900">{hours}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage