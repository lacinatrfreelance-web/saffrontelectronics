import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/services/api'
import type { DashboardStats } from '@/admin/types/admin.types'

export function useDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      // Fetch multiple endpoints in parallel for dashboard stats
      const [productsRes, categoriesRes, messagesRes, promotionsRes] = await Promise.all([
        adminApi.get('/products?per_page=5&sort_by=created_at&sort_order=desc'),
        adminApi.get('/categories'),
        adminApi.get('/messages?per_page=5&sort_by=created_at&sort_order=desc'),
        adminApi.get('/promotions'),
      ])

      const products = productsRes.data
      const categories = categoriesRes.data
      const messages = messagesRes.data
      const promotions = promotionsRes.data

      const stats: DashboardStats = {
        total_products: products.total || 0,
        active_products: 0,
        total_categories: categories.data?.length || 0,
        total_promotions: promotions.data?.length || 0,
        active_promotions: promotions.data?.filter((p: any) => p.is_active)?.length || 0,
        unread_messages: messages.data?.filter((m: any) => !m.is_read)?.length || 0,
        total_messages: messages.total || 0,
        recent_products: products.data?.slice(0, 5) || [],
        recent_messages: messages.data?.slice(0, 5) || [],
      }

      return stats
    },
  })
}