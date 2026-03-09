import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { adminAuth } from '@/services/adminAuth'

export const ProtectedRoute: React.FC = () => {
  if (!adminAuth.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }
  return <Outlet />
}

export default ProtectedRoute