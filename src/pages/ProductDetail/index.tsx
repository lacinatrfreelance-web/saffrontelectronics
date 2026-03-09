// ─── ProductDetailPage.tsx ───────────────────────────────────────────────────
import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Phone, MessageSquare, Package, Tag, CheckCircle, ChevronRight, ZoomIn } from 'lucide-react'
import { useProduct, useRelatedProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/ui/Card/ProductCard'
import { formatPrice, getImageUrl } from '@/utils/formatters'
import { COMPANY } from '@/utils/constants'

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description')

  const { data: product, isLoading, error } = useProduct(slug || '')
  const { data: related } = useRelatedProducts(slug || '')

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-28">
        <div className="container-custom py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-3xl animate-pulse" />
            <div className="space-y-4 pt-4">
              <div className="h-4 bg-gray-200 rounded-full animate-pulse w-24" />
              <div className="h-9 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-9 bg-gray-200 rounded-full animate-pulse w-3/4" />
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-32 mt-8" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-gray-50 min-h-screen pt-28">
        <div className="container-custom py-20 text-center">
          <p className="text-gray-400 mb-5 text-lg">Produit non trouvé</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-6 py-3 rounded-2xl hover:bg-orange-500 transition-colors"
          >
            Retour aux produits
          </Link>
        </div>
      </div>
    )
  }

  // ✅ Utilise `images` qui contient maintenant des URLs complètes via ProductResource
  const images: string[] = product.images?.length > 0 ? product.images : []
  const hasPromo = product.is_promotion && product.promotional_price
  const whatsappMsg = encodeURIComponent(
    `Bonjour, je suis interesse par: ${product.name} (${formatPrice(product.final_price)}). Pouvez-vous me donner plus d'informations ?`
  )

  return (
    <>
      <Helmet>
        <title>{product.name} — Saffron Electronics CI</title>
        <meta name="description" content={product.short_description || product.description?.slice(0, 160)} />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100 pt-20">
          <div className="container-custom py-4">
            <nav className="flex items-center gap-2 text-xs text-gray-400">
              <Link to="/" className="hover:text-orange-500 transition-colors font-medium">Accueil</Link>
              <ChevronRight size={12} />
              <Link to="/products" className="hover:text-orange-500 transition-colors font-medium">Produits</Link>
              <ChevronRight size={12} />
              <span className="text-gray-700 font-semibold truncate max-w-xs">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-orange-500 mb-8 transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Retour aux produits
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* ── Images ── */}
            <div>
              <div className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden aspect-square mb-3 shadow-sm hover:shadow-xl transition-shadow duration-500">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    // ✅ getImageUrl reçoit déjà une URL complète depuis ProductResource
                    src={getImageUrl(images[activeImage])}
                    alt={product.name}
                    className="w-full h-full object-contain p-8"
                    onError={(e) => {
                      // ✅ Fallback local, plus de via.placeholder.com
                      (e.target as HTMLImageElement).src = '/placeholder.jpg'
                    }}
                  />
                </AnimatePresence>

                <div className="absolute top-4 right-4 w-9 h-9 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={16} className="text-gray-400" />
                </div>

                {hasPromo && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-lg">
                    -{product.discount_percentage}%
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                        activeImage === i
                          ? 'border-orange-400 shadow-md shadow-orange-200'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg' }}
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Product info ── */}
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-2 mb-5">
                {product.is_new && (
                  <span className="bg-amber-50 border border-amber-200 text-amber-600 text-xs font-black px-3 py-1.5 rounded-xl">
                    NOUVEAU
                  </span>
                )}
                <span className={`text-xs font-black px-3 py-1.5 rounded-xl border ${
                  product.stock > 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'bg-red-50 border-red-200 text-red-500'
                }`}>
                  {product.stock > 0 ? 'EN STOCK' : 'RUPTURE DE STOCK'}
                </span>
              </div>

              <p className="text-xs font-black text-orange-500 uppercase tracking-[0.18em] mb-3">
                {product.category?.name}
              </p>
              <h1 className="text-2xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap gap-3 mb-7 text-xs">
                {product.brand && (
                  <span className="flex items-center gap-1.5 bg-gray-100 text-gray-500 font-semibold px-3 py-1.5 rounded-xl">
                    <Tag size={11} className="text-orange-400" />
                    {product.brand}
                  </span>
                )}
                {product.reference && (
                  <span className="flex items-center gap-1.5 bg-gray-100 text-gray-500 font-semibold px-3 py-1.5 rounded-xl">
                    <Package size={11} className="text-orange-400" />
                    {product.reference}
                  </span>
                )}
              </div>

              {/* Price block */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 mb-7 shadow-sm">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-black text-gray-900">{formatPrice(product.final_price)}</span>
                  {hasPromo && (
                    <span className="text-xl text-gray-300 line-through font-medium">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                {hasPromo && (
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black px-2.5 py-1 rounded-lg">
                      Economie de {formatPrice(product.price - product.final_price)}
                    </span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 mb-7">
                <motion.a
                  href={`tel:${COMPANY.phone}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow text-sm"
                >
                  <Phone size={17} />
                  Appeler pour commander
                </motion.a>
                <motion.a
                  href={`https://wa.me/${COMPANY.phone.replace(/\s+/g, '').replace('+', '')}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-green-500/20 hover:shadow-green-500/35 transition-shadow text-sm"
                >
                  <MessageSquare size={17} />
                  WhatsApp
                </motion.a>
              </div>

              {/* Reassurance */}
              <div className="flex flex-col gap-2.5">
                {[
                  'Garantie constructeur incluse',
                  'Produit 100% original certifié',
                  product.stock > 0
                    ? product.stock <= 5
                      ? `Plus que ${product.stock} en stock`
                      : 'Disponible immédiatement en showroom'
                    : null,
                ]
                  .filter(Boolean)
                  .map((item) => (
                    <div key={item as string} className="flex items-center gap-2.5 text-sm text-gray-500">
                      <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                      {item}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden mb-14 shadow-sm">
            <div className="flex border-b border-gray-100">
              {(['description', 'specs'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-7 py-5 text-sm font-black transition-colors ${
                    activeTab === tab ? 'text-orange-500' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {tab === 'description' ? 'Description' : 'Spécifications'}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="tabIndicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="p-8">
              {activeTab === 'description' ? (
                <div
                  className="prose prose-sm max-w-none text-gray-500 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description || '<p>Aucune description disponible.</p>' }}
                />
              ) : product.specifications && Object.keys(product.specifications).length > 0 ? (
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-3 px-4 font-bold text-gray-700 w-1/3 rounded-l-xl">{key}</td>
                        <td className="py-3 px-4 text-gray-500 rounded-r-xl">{value as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">Aucune spécification disponible.</p>
              )}
            </div>
          </div>

          {/* ── Related ── */}
          {related && related.length > 0 && (
            <div>
              <p className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-3">Vous aimerez aussi</p>
              <h2 className="text-3xl font-black text-gray-900 mb-8">Produits similaires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductDetailPage