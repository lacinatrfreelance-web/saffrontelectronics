import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import type { Product } from '@/types/product.types'
import { formatPrice, getImageUrl } from '@/utils/formatters'

interface ProductCardProps {
  product: Product
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const hasPromo =
    product.is_promotion === true &&
    product.promotional_price !== null &&
    product.promotional_price !== undefined &&
    product.promotional_price < product.price

  const discountPercentage =
    hasPromo && product.price > 0
      ? Math.round(((product.price - (product.promotional_price || 0)) / product.price) * 100)
      : 0

  const getProductImage = (): string => {
    if ((product as any).main_image) return getImageUrl((product as any).main_image)
    if (product.images?.length > 0 && product.images[0]) return getImageUrl(product.images[0])
    return '/placeholder.jpg'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group ${className}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={getProductImage()}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            if (target.src !== window.location.origin + '/placeholder.jpg') {
              target.src = '/placeholder.jpg'
            }
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasPromo && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              -{discountPercentage}%
            </span>
          )}
          {product.is_new && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              NOUVEAU
            </span>
          )}
        </div>

        {/* Stock badge */}
        <div className="absolute top-3 right-3">
          {product.stock <= 0 ? (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
              Rupture
            </span>
          ) : product.stock <= 5 ? (
            <span className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
              Stock faible
            </span>
          ) : null}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/products/${product.slug}`}
            className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-colors shadow-lg"
          >
            <Eye size={15} />
            Voir le détail
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {product.category?.name && (
          <p className="text-xs text-orange-500 font-medium uppercase tracking-wide mb-1">
            {product.category.name}
          </p>
        )}

        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 hover:text-orange-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.brand && (
          <p className="text-xs text-gray-400 mb-2">{product.brand}</p>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.final_price || product.price)}
          </span>
          {hasPromo && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
     
export default ProductCard