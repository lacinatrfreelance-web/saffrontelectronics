import { useState, useCallback } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { adminApi } from '@/services/api'
import { adminAuth } from '@/services/adminAuth'
import { ADMIN_ENDPOINTS } from '@/services/endpoints'
import type { LoginCredentials, AdminUser } from '@/admin/types/admin.types'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export function useAdminAuth() {
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => adminAuth.login(credentials),
    onSuccess: () => {
      navigate('/admin/dashboard')
      toast.success('Connexion reussie')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Identifiants incorrects')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => adminAuth.logout(),
    onSuccess: () => {
      navigate('/admin/login')
    },
  })

  const profileQuery = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const { data } = await adminApi.get<{ data: AdminUser }>(ADMIN_ENDPOINTS.PROFILE)
      return data.data
    },
    enabled: adminAuth.isAuthenticated(),
    retry: false,
  })

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    user: adminAuth.getUser(),
    profile: profileQuery.data,
    isAuthenticated: adminAuth.isAuthenticated(),
  }
}