import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Clock, Tag, Flame, ArrowRight, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePromotions, useCurrentPromotion } from '@/hooks/usePromotions'
import { useOnSaleProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/ui/Card/ProductCard'
import { getCountdown, formatDate } from '@/utils/formatters'

// ── Animated flip number ──────────────────────────────────────────────────────
const FlipNumber: React.FC<{ value: number }> = ({ value }) => {
  const str = String(value).padStart(2, '0')
  return (
    <div className="relative w-16 h-16 md:w-20 md:h-20">
      <motion.div
        key={value}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/10"
        style={{ backfaceVisibility: 'hidden' }}
      >
        <span className="text-2xl md:text-3xl font-black text-gray-900 tabular-nums">{str}</span>
      </motion.div>
    </div>
  )
}

// ── Section par campagne ──────────────────────────────────────────────────────
const PromoCampaignSection: React.FC<{ promo: any; index: number }> = ({ promo, index }) => {
  const products: any[] = promo.products ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="mb-16"
    >
      {/* En-tête campagne */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 rounded-3xl p-6 mb-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-200/40 to-transparent rounded-bl-[80px]" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm px-3 py-1.5 rounded-xl shadow-lg shadow-orange-500/20">
                -{promo.discount_percentage}%
              </span>
              {promo.is_active && (
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 border border-green-100 text-xs font-bold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active
                </span>
              )}
              <span className="text-xs text-gray-400">
                {products.length} produit{products.length > 1 ? 's' : ''}
              </span>
            </div>
            <h2 className="text-xl font-black text-gray-900">{promo.title}</h2>
            {promo.description && (
              <p className="text-sm text-gray-500 mt-1 max-w-lg">{promo.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 whitespace-nowrap shrink-0">
            <Clock size={12} />
            {formatDate(promo.start_date)} — {formatDate(promo.end_date)}
          </div>
        </div>
      </div>

      {/* Grille produits */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product: any, i: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.07 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-white border border-dashed border-gray-200 rounded-2xl px-6 py-8 text-gray-400">
          <Package size={20} className="shrink-0 text-gray-300" />
          <p className="text-sm">Aucun produit associé à cette campagne.</p>
        </div>
      )}
    </motion.div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────
export const PromotionsPage: React.FC = () => {
  const { data: promotions, isLoading: loadingPromos } = usePromotions()
  const { data: saleProducts, isLoading: loadingProducts } = useOnSaleProducts()
  const { data: currentPromo } = useCurrentPromotion()

  const [countdown, setCountdown] = useState(
    currentPromo ? getCountdown(currentPromo.end_date) : null
  )

  useEffect(() => {
    if (!currentPromo) return
    const interval = setInterval(() => setCountdown(getCountdown(currentPromo.end_date)), 1000)
    return () => clearInterval(interval)
  }, [currentPromo])

  // Produits déjà couverts par une campagne (via pivot)
  const campaignProductIds = new Set<number>(
    (promotions ?? []).flatMap((p: any) => (p.products ?? []).map((prod: any) => prod.id))
  )

  // Produits en promo via special_price uniquement (pas liés à une campagne)
  const standalonePromoProducts = (saleProducts ?? []).filter(
    (p: any) => !campaignProductIds.has(p.id)
  )

  const isEmpty =
    !loadingPromos &&
    !loadingProducts &&
    (!promotions || promotions.length === 0) &&
    standalonePromoProducts.length === 0

  return (
    <>
      <Helmet>
        <title>Promotions — Saffron Electronics CI</title>
        <meta
          name="description"
          content="Découvrez les promotions en cours chez Saffron Electronics. Jusqu'à 40% de remise sur l'électroménager à Abidjan."
        />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pt-28 pb-20">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-orange-300/25 to-amber-200/20 pointer-events-none"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-orange-200/40 pointer-events-none" />

        {['-10%', '-25%', '-40%', '-15%'].map((tag, i) => (
          <motion.div
            key={tag}
            animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
            className="absolute hidden lg:flex items-center gap-1.5 bg-white border border-orange-100 px-4 py-2 rounded-full shadow-xl shadow-orange-100/50 text-sm font-black text-orange-500"
            style={{ top: `${[30, 55, 20, 70][i]}%`, right: `${[8, 12, 20, 6][i]}%` }}
          >
            <Tag size={12} />
            {tag}
          </motion.div>
        ))}

        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em] mb-8"
            >
              <Flame size={13} fill="currentColor" />
              Offres limitées
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-6xl md:text-8xl font-black text-gray-900 leading-none mb-6"
            >
              Jusqu'à<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                -40%
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-gray-500 text-xl mb-12 max-w-lg"
            >
              Sur une sélection de réfrigérateurs, climatiseurs, télévisions et bien plus.
            </motion.p>

            {/* Countdown */}
            {currentPromo && countdown && !countdown.expired && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-5">
                  <Clock size={14} />
                  <span>
                    Fin de <strong className="text-gray-700">"{currentPromo.title}"</strong> dans
                  </span>
                </div>
                <div className="flex items-end gap-3">
                  {[
                    { value: countdown.days,    label: 'Jours' },
                    { value: countdown.hours,   label: 'Heures' },
                    { value: countdown.minutes, label: 'Min' },
                    { value: countdown.seconds, label: 'Sec' },
                  ].map(({ value, label }, i) => (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center gap-2">
                        <FlipNumber value={value} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {label}
                        </span>
                      </div>
                      {i < 3 && <span className="text-gray-300 font-black text-2xl pb-7">:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── Campagnes promotionnelles ── */}
      {!loadingPromos && promotions && promotions.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-custom">
            <div className="mb-10">
              <p className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-2">
                Campagnes
              </p>
              <h2 className="text-4xl font-black text-gray-900">Nos promotions</h2>
            </div>

            {promotions.map((promo: any, i: number) => (
              <PromoCampaignSection key={promo.id} promo={promo} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── Produits en promo via special_price (hors campagne) ── */}
      {!loadingProducts && standalonePromoProducts.length > 0 && (
        <section className="bg-gray-50 py-20 border-t border-gray-100">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-2">
                  Sélection
                </p>
                <h2 className="text-4xl font-black text-gray-900">Autres offres</h2>
                <p className="text-gray-400 mt-2 text-sm">
                  {standalonePromoProducts.length} produit{standalonePromoProducts.length > 1 ? 's' : ''} en promotion
                </p>
              </div>
              <Link
                to="/products?is_promotion=true"
                className="hidden md:flex items-center gap-1.5 text-sm font-bold text-orange-500 hover:text-orange-600"
              >
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {standalonePromoProducts.map((product: any, i: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 4) * 0.08 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Empty state ── */}
      {isEmpty && (
        <section className="bg-gray-50 py-32">
          <div className="container-custom text-center">
            <div className="w-20 h-20 bg-amber-50 border border-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Tag size={32} className="text-amber-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Aucune promotion en cours</h2>
            <p className="text-gray-400 mb-8">Revenez bientôt pour découvrir nos offres.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:bg-orange-600 transition-colors"
            >
              Voir tous les produits <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </>
  )
}

export default PromotionsPage