import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { ENDPOINTS } from '@/services/endpoints'
import type { Promotion } from '@/types/product.types'

export function usePromotions() {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Promotion[] }>(ENDPOINTS.PROMOTIONS)
      return data.data
    },
  })
}

export function useCurrentPromotion() {
  return useQuery({
    queryKey: ['promotion-current'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Promotion | null }>(ENDPOINTS.PROMOTION_CURRENT)
      return data.data
    },
  })
}

export function usePromotion(id: number) {
  return useQuery({
    queryKey: ['promotion', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Promotion }>(ENDPOINTS.PROMOTION(id))
      return data.data
    },
    enabled: !!id,
  })
}