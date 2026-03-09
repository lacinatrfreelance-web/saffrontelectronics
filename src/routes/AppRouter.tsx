import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'

const HomePage = lazy(() => import('@/pages/Home'))
const ProductsPage = lazy(() => import('@/pages/Products'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetail'))
const AboutPage = lazy(() => import('@/pages/About'))
const ContactPage = lazy(() => import('@/pages/Contact'))
const PromotionsPage = lazy(() => import('@/pages/Promotions'))
const NotFoundPage = lazy(() => import('@/pages/NotFound'))

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-secondary-400 text-sm">Chargement...</p>
    </div>
  </div>
)

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRouter