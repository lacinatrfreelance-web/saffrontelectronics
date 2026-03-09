import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AdminLayout } from '@/admin/components/Layout/AdminLayout'
import { ProtectedRoute } from '@/admin/components/Layout/ProtectedRoute'

const AdminLoginPage = lazy(() => import('@/admin/pages/Login'))
const AdminDashboardPage = lazy(() => import('@/admin/pages/Dashboard'))
const AdminProductsPage = lazy(() => import('@/admin/pages/Products'))
const AdminProductCreatePage = lazy(() => import('@/admin/pages/Products/Create'))
const AdminProductEditPage = lazy(() => import('@/admin/pages/Products/Edit'))
const AdminCategoriesPage = lazy(() => import('@/admin/pages/Categories'))
const AdminPromotionsPage = lazy(() => import('@/admin/pages/Promotions'))
const AdminMessagesPage = lazy(() => import('@/admin/pages/Messages'))
const AdminPagesPage = lazy(() => import('@/admin/pages/Pages'))
const AdminSettingsPage = lazy(() => import('@/admin/pages/Settings'))

const AdminFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

export const AdminRouter: React.FC = () => {
  return (
    <Suspense fallback={<AdminFallback />}>
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/create" element={<AdminProductCreatePage />} />
            <Route path="products/:id/edit" element={<AdminProductEditPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="promotions" element={<AdminPromotionsPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="pages" element={<AdminPagesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AdminRouter