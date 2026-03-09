import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { ENDPOINTS } from '@/services/endpoints'
import type { Category, Product, PaginatedResponse, ProductFilters } from '@/types/product.types'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Category[] }>(ENDPOINTS.CATEGORIES)
      return data.data
    },
  })
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data } = await api.get<{ data: Category }>(ENDPOINTS.CATEGORY(slug))
      return data.data
    },
    enabled: !!slug,
  })
}

export function useCategoryProducts(slug: string, filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['category-products', slug, filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
      const { data } = await api.get<PaginatedResponse<Product>>(
        `${ENDPOINTS.CATEGORY_PRODUCTS(slug)}?${params.toString()}`
      )
      return data
    },
    enabled: !!slug,
  })
}