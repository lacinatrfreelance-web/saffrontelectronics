import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Wind, Thermometer, Tv, WashingMachine, Microwave, Snowflake, Fan, Zap } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { getImageUrl } from '@/utils/formatters'

const CATEGORY_COLORS = [
  { bg: 'from-amber-400 to-orange-500', light: 'bg-amber-50 border-amber-100' },
  { bg: 'from-blue-400 to-indigo-500', light: 'bg-blue-50 border-blue-100' },
  { bg: 'from-emerald-400 to-teal-500', light: 'bg-emerald-50 border-emerald-100' },
  { bg: 'from-rose-400 to-pink-500', light: 'bg-rose-50 border-rose-100' },
  { bg: 'from-violet-400 to-purple-500', light: 'bg-violet-50 border-violet-100' },
  { bg: 'from-cyan-400 to-sky-500', light: 'bg-cyan-50 border-sky-100' },
]

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase()
  if (lower.includes('climatiseur') || lower.includes('clim')) return Wind
  if (lower.includes('refriger') || lower.includes('frigo')) return Thermometer
  if (lower.includes('tv') || lower.includes('television')) return Tv
  if (lower.includes('lave') || lower.includes('machine')) return WashingMachine
  if (lower.includes('four') || lower.includes('micro')) return Microwave
  if (lower.includes('congelateur')) return Snowflake
  if (lower.includes('ventilateur')) return Fan
  return Zap
}

// Défini EN DEHORS — même pattern que AdminCategoriesPage
const CategoryIcon: React.FC<{
  image: string | null
  name: string
  colors: { bg: string }
  iconComp: React.ElementType
}> = ({ image, name, colors, iconComp: IconComp }) => {
  const [broken, setBroken] = useState(false)
  const url = image ? getImageUrl(image) : null

  return (
    <motion.div
      whileHover={{ rotate: 10, scale: 1.15 }}
      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow overflow-hidden`}
    >
      {url && !broken ? (
        <img
          src={url}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <IconComp size={22} className="text-white" />
      )}
    </motion.div>
  )
}

export const CategoriesGrid: React.FC = () => {
  const { data: categories, isLoading } = useCategories()

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="h-8 bg-gray-100 rounded-full w-40 mb-10 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  }
  const item = {
    hidden: { opacity: 0, y: 24, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <section className="py-20 bg-white border-t border-gray-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-xs font-black text-orange-500 uppercase tracking-[0.22em] mb-2">Explorer</p>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">Nos categories</h2>
          </div>
          <Link
            to="/products"
            className="hidden md:inline-flex items-center gap-2 text-sm font-black text-gray-900 hover:text-orange-500 group transition-colors"
          >
            Tout voir
            <span className="w-7 h-7 rounded-xl bg-gray-100 group-hover:bg-orange-500 flex items-center justify-center transition-colors">
              <ArrowRight size={13} className="group-hover:text-white transition-colors" />
            </span>
          </Link>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories?.slice(0, 6).map((category, index) => {
            const IconComp = getCategoryIcon(category.name)
            const colors = CATEGORY_COLORS[index % CATEGORY_COLORS.length]

            return (
              <motion.div key={category.id} variants={item}>
                <Link to={`/products?category=${category.slug}`} className="group block">
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className={`relative overflow-hidden rounded-3xl border p-6 text-center transition-all duration-300 cursor-pointer ${colors.light} group-hover:shadow-xl`}
                  >
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl`} />

                    {/* Icon / Image */}
                    <div className="relative z-10 mb-4">
                      <CategoryIcon
                        image={category.image}
                        name={category.name}
                        colors={colors}
                        iconComp={IconComp}
                      />
                    </div>

                    {/* Text */}
                    <div className="relative z-10">
                      <p className="font-black text-gray-900 text-xs group-hover:text-white transition-colors leading-tight">
                        {category.name}
                      </p>
                      {category.products_count !== undefined && (
                        <p className="text-[10px] text-gray-400 group-hover:text-white/60 mt-1 transition-colors">
                          {category.products_count} produit{category.products_count !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default CategoriesGrid