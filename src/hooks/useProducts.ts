import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { ENDPOINTS } from '@/services/endpoints'
import type { Product, ProductFilters, PaginatedResponse, HomeData } from '@/types/product.types'

export function useHomeData() {
  return useQuery({
    queryKey: ['home'],
    queryFn: async () => {
      const { data } = await api.get<{ data: HomeData }>(ENDPOINTS.HOME)
      return data.data
    },
  })
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        // Ne pas envoyer : undefined, null, '', false
        if (value === undefined || value === null || value === '' || value === false) return
        params.append(key, String(value))
      })
      const { data } = await api.get<PaginatedResponse<Product>>(
        `${ENDPOINTS.PRODUCTS}?${params.toString()}`
      )
      return data
    },
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get<{ data: Product }>(ENDPOINTS.PRODUCT(slug))
      return data.data
    },
    enabled: !!slug,
  })
}

export function useRelatedProducts(slug: string) {
  return useQuery({
    queryKey: ['related', slug],
    queryFn: async () => {
      const { data } = await api.get<{ data: Product[] }>(ENDPOINTS.PRODUCT_RELATED(slug))
      return data.data
    },
    enabled: !!slug,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Product[] }>(ENDPOINTS.PRODUCTS_FEATURED)
      return data.data
    },
  })
}

export function useNewProducts() {
  return useQuery({
    queryKey: ['products', 'new'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Product[] }>(ENDPOINTS.PRODUCTS_NEW)
      return data.data
    },
  })
}

export function useOnSaleProducts() {
  return useQuery({
    queryKey: ['products', 'on-sale'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Product[] }>(ENDPOINTS.PRODUCTS_ON_SALE)
      return data.data
    },
  })
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data } = await api.get<{ data: string[] }>(ENDPOINTS.PRODUCTS_BRANDS)
      return data.data
    },
  })
}