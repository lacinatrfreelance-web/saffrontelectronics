import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProductCard } from '@/components/ui/Card/ProductCard'
import type { Product } from '@/types/product.types'

interface FeaturedProductsProps {
  title: string
  subtitle?: string
  label?: string         
  products: Product[]
  isLoading?: boolean
  viewAllLink?: string
  viewAllLabel?: string
  dark?: boolean        
}

// Skeleton with moving shimmer
const SkeletonCard: React.FC = () => (
  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
    <div className="aspect-square bg-gray-100 relative overflow-hidden">
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.3 }}
        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />
    </div>
    <div className="p-5 space-y-3">
      <div className="h-2.5 bg-gray-100 rounded-full w-1/3" />
      <div className="h-4 bg-gray-100 rounded-full" />
      <div className="h-4 bg-gray-100 rounded-full w-3/4" />
      <div className="h-5 bg-gray-100 rounded-full w-2/5 mt-2" />
    </div>
  </div>
)

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  subtitle,
  label,
  products,
  isLoading = false,
  viewAllLink = '/products',
  viewAllLabel = 'Voir tout',
  dark = false,
}) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, margin: '-60px' })

  if (!isLoading && products.length === 0) return null

  const cardVariants = {
    hidden: { opacity: 0, y: 32, scale: 0.97 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.55,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  }

  return (
    <section className={`py-20 ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="container-custom">

        {/* Header row */}
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            label={label}
            title={title}
            subtitle={subtitle}
            light={dark}
          />

          {/* Desktop "view all" */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="hidden md:block shrink-0 mb-5"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to={viewAllLink}
                className={`inline-flex items-center gap-2 text-sm font-black group transition-colors ${
                  dark
                    ? 'text-white/40 hover:text-orange-400'
                    : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                {viewAllLabel}
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    dark
                      ? 'bg-white/8 group-hover:bg-orange-500'
                      : 'bg-gray-200 group-hover:bg-orange-500'
                  }`}
                >
                  <ArrowRight
                    size={14}
                    className="group-hover:text-white transition-colors text-current"
                  />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {products.slice(0, 4).map((product, i) => (
              <motion.div
                key={product.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 400, damping: 22 } }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-10 text-center md:hidden">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to={viewAllLink}
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-orange-500 text-white font-black text-sm px-7 py-3.5 rounded-2xl transition-colors duration-300"
            >
              {viewAllLabel}
              <ChevronRight size={15} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts