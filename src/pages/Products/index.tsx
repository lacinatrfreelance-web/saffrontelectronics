import React, { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Search, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { ProductCard } from '@/components/ui/Card/ProductCard'
import type { ProductFilters } from '@/types/product.types'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export const ProductsPage: React.FC = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const debouncedSearch = useDebounce(searchInput, 300)

  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || '',
    is_new: searchParams.get('is_new') === 'true',
    is_promotion: searchParams.get('is_promotion') === 'true',
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 12,
    page: 1,
  })

  const activeFilters = { ...filters, search: debouncedSearch || undefined }
  const { data, isLoading, isFetching } = useProducts(activeFilters)
  const { data: categories } = useCategories()

  const updateFilter = useCallback((key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }, [])

  const clearFilters = () => {
    setFilters({ sort_by: 'created_at', sort_order: 'desc', per_page: 12, page: 1 })
    setSearchInput('')
  }

  const activeFilterCount = [
    filters.category,
    filters.is_new,
    filters.is_promotion,
    debouncedSearch,
  ].filter(Boolean).length

  return (
    <>
      <Helmet>
        <title>{t('products.meta.title')}</title>
        <meta name="description" content={t('products.meta.description')} />
      </Helmet>

      {/* Header */}
      <section className="bg-white border-b border-gray-100 pt-28 pb-10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-black text-orange-500 uppercase tracking-[0.22em] mb-3">
              {t('products.shopBadge')}
            </p>
            <div className="flex items-end justify-between gap-4">
              <h1 className="text-5xl font-black text-gray-900 leading-none">{t('products.title')}</h1>
              <span className="text-sm text-gray-400 pb-2">
                {data?.total !== undefined ? `${data.total} ${t('products.results')}` : ''}
              </span>
            </div>
          </motion.div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            {/* Search */}
            <div className="flex-1 min-w-64 relative group">
              <Search
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-400 transition-colors"
              />
              <input
                placeholder={t('products.search')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-400 focus:bg-white rounded-2xl text-gray-900 text-sm placeholder-gray-300 outline-none transition-all duration-200 focus:shadow-[0_0_0_4px_rgba(249,115,22,0.08)]"
              />
              <AnimatePresence>
                {searchInput && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchInput('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  >
                    <X size={10} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={`${filters.sort_by}_${filters.sort_order}`}
                onChange={(e) => {
                  const parts = e.target.value.split('_')
                  const order = parts.pop() as 'asc' | 'desc'
                  const field = parts.join('_')
                  updateFilter('sort_by', field)
                  updateFilter('sort_order', order)
                }}
                className="appearance-none pl-4 pr-9 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-400 rounded-2xl text-sm text-gray-600 outline-none cursor-pointer transition-all"
              >
                <option value="created_at_desc">{t('products.sortRecent')}</option>
                <option value="created_at_asc">{t('products.sortOldest')}</option>
                <option value="price_asc">{t('products.sortPriceAsc')}</option>
                <option value="price_desc">{t('products.sortPriceDesc')}</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Mobile filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden flex items-center gap-2 py-3 px-4 rounded-2xl text-sm font-bold border-2 transition-all ${
                showFilters
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-gray-50 border-transparent text-gray-600'
              }`}
            >
              <SlidersHorizontal size={14} />
              {t('products.filters')}
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-orange-500 text-xs flex items-center justify-center font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar */}
            <aside className={`lg:w-56 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white border border-gray-100 rounded-3xl p-6 sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-gray-900 text-sm">{t('products.filters')}</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs font-bold text-red-400 hover:text-red-500 flex items-center gap-1"
                    >
                      <X size={11} /> {t('products.clearFilters')}
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                    {t('products.categories')}
                  </p>
                  <div className="flex flex-col gap-1">
                    {[{ id: '', name: t('products.all'), slug: '' }, ...(categories || [])].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => updateFilter('category', cat.slug)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-200 ${
                          filters.category === cat.slug
                            ? 'bg-orange-50 text-orange-500 border border-orange-100'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {cat.name}
                        {filters.category === cat.slug && (
                          <motion.span layoutId="catActive" className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100 mb-5" />

                {/* Options */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                    {t('products.options')}
                  </p>
                  {[
                    { key: 'is_new',       labelKey: 'products.isNew'   },
                    { key: 'is_promotion', labelKey: 'products.isPromo' },
                  ].map(({ key, labelKey }) => (
                    <button
                      key={key}
                      onClick={() => updateFilter(key as keyof ProductFilters, !(filters as any)[key])}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold mb-1.5 transition-all ${
                        (filters as any)[key]
                          ? 'bg-orange-50 text-orange-500 border border-orange-100'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {t(labelKey)}
                      <div className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${(filters as any)[key] ? 'bg-orange-500' : 'bg-gray-200'}`}>
                        <motion.div
                          animate={{ x: (filters as any)[key] ? 16 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                          className="w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products grid */}
            <div className="flex-1">
              {isLoading || isFetching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
                      <div className="aspect-square bg-gray-100 animate-pulse" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 bg-gray-100 rounded-full animate-pulse w-1/3" />
                        <div className="h-4 bg-gray-100 rounded-full animate-pulse" />
                        <div className="h-5 bg-gray-100 rounded-full animate-pulse w-2/5 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.data?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white border border-gray-100 rounded-3xl"
                >
                  <div className="w-16 h-16 bg-orange-50 border border-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
                    <Search size={24} className="text-orange-300" />
                  </div>
                  <h3 className="font-black text-gray-900 text-xl mb-2">{t('products.noResults')}</h3>
                  <p className="text-gray-400 mb-6 text-sm">{t('products.noResultsHint')}</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-orange-500 transition-colors"
                  >
                    {t('products.clearFilters')}
                  </button>
                </motion.div>
              ) : (
                <>
                  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    <AnimatePresence>
                      {data?.data?.map((product, i) => (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: (i % 6) * 0.06 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Pagination */}
                  {data && data.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      {[...Array(data.last_page)].map((_, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => updateFilter('page', i + 1)}
                          className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                            data.current_page === i + 1
                              ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/25'
                              : 'bg-white text-gray-500 border border-gray-100 hover:border-orange-200 hover:text-orange-500'
                          }`}
                        >
                          {i + 1}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductsPage