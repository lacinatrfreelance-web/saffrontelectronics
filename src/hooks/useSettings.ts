import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { ENDPOINTS } from '@/services/endpoints'
import type { SiteSettings } from '@/types/product.types'

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get<{ data: SiteSettings }>(ENDPOINTS.SETTINGS)
      return data.data
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}