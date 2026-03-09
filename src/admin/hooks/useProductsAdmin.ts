import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/services/api'
import { ADMIN_ENDPOINTS } from '@/services/endpoints'
import type { AdminProduct } from '@/admin/types/admin.types'
import toast from 'react-hot-toast'

export function useAdminProducts(page = 1, search = '') {
  return useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.append('search', search)
      const { data } = await adminApi.get(`${ADMIN_ENDPOINTS.PRODUCTS}?${params}`)
      return data
    },
  })
}

export function useAdminProduct(id: number) {
  return useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      const { data } = await adminApi.get(ADMIN_ENDPOINTS.PRODUCT(id))
      return data.data as AdminProduct
    },
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await adminApi.post(ADMIN_ENDPOINTS.PRODUCTS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Produit cree avec succes')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la creation')
    },
  })
}

export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      formData.append('_method', 'PUT')
      const { data } = await adminApi.post(ADMIN_ENDPOINTS.PRODUCT(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['admin-product', id] })
      toast.success('Produit mis a jour')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise a jour')
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await adminApi.delete(ADMIN_ENDPOINTS.PRODUCT(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Produit supprime')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    },
  })
}