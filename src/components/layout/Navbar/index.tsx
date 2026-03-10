import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { COMPANY } from '@/utils/constants'
import { LanguageSwitcher } from '../../../components/ui/LanguageSwitcher'
import logo from '@/assets/logo_saffron.png'

const NAV_LINKS = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/products', labelKey: 'nav.products' },
  { to: '/promotions', labelKey: 'nav.promotions' },
  { to: '/about', labelKey: 'nav.about' },
  { to: '/contact', labelKey: 'nav.contact' },
]

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const location = useLocation()
  const { t } = useTranslation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-1' : 'py-3'}`}>
      <div className={`absolute inset-0 transition-all duration-500 ${
        scrolled ? 'bg-white/92 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.06),0_8px_32px_rgba(0,0,0,0.06)]' : 'bg-transparent'
      }`} />

      <div className="container-custom relative z-10">
        <div className="flex items-center justify-between">

          {/* Logo + avatars */}
          <Link to="/" className="flex flex-col items-start group">
            <motion.img
              src={logo}
              alt="Saffron Electronics CI"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`object-contain transition-all duration-300 ${
                scrolled ? 'h-16' : 'h-20'
              }`}
            />
            {/* Social proof avatars — desktop only */}
            <div className="hidden md:flex items-center gap-2 -mt-1 pl-1">
              <div className="flex -space-x-1.5">
                {(['#F97316','#FBBF24','#34D399','#818CF8','#FB7185'] as const).map((bg, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px] font-black"
                    style={{ backgroundColor: bg, zIndex: 5 - i }}
                  >
                    {['A','K','S','M','F'][i]}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-semibold text-gray-400">+5 000 clients</span>
            </div>
          </Link>

          {/* Desktop Nav with hover pill */}
          <nav className="hidden md:flex items-center gap-0.5" onMouseLeave={() => setHovered(null)}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onMouseEnter={() => setHovered(link.to)}
                className={({ isActive }) =>
                  `relative px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-150 ${
                    isActive ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {hovered === link.to && (
                      <motion.span
                        layoutId="navPill"
                        className="absolute inset-0 rounded-xl bg-gray-100"
                        style={{ zIndex: -1 }}
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.35 }}
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="navDot"
                        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500"
                      />
                    )}
                    {t(link.labelKey)}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher variant="light" />
            <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-orange-500 transition-colors">
              <Phone size={13} />
              {COMPANY.phone}
            </a>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/contact"
                className="relative overflow-hidden inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">{t('nav.contactUs')}</span>
                <ChevronRight size={13} className="relative group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Hamburger */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isOpen
                ? <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}><X size={18} /></motion.div>
                : <motion.div key="m" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}><Menu size={18} /></motion.div>}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl"
          >
            <div className="container-custom py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold ${
                        isActive ? 'bg-orange-50 text-orange-500' : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    {t(link.labelKey)}
                    <ChevronRight size={13} className="text-gray-300" />
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between">
                <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Phone size={13} className="text-orange-500" />{COMPANY.phone}
                </a>
                <LanguageSwitcher variant="light" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar