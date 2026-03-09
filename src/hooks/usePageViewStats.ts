import { useEffect, useState } from 'react'
import { adminApi } from '@/services/api'

export interface DailyView {
  date: string   // "YYYY-MM-DD"
  count: number
}

export interface PageViewStats {
  page: string
  total: number
  today: number
  daily: DailyView[]
}

interface UsePageViewStatsResult {
  stats: PageViewStats | null
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * usePageViewStats
 * Récupère les statistiques de vues depuis l'API admin.
 * Le token est injecté automatiquement via l'intercepteur adminApi.
 * La déconnexion auto sur 401 est aussi gérée par l'intercepteur.
 *
 * Usage (dans AdminDashboardPage) :
 *   const { stats, loading } = usePageViewStats('home', 30)
 */
export function usePageViewStats(
  page: string = 'home',
  days: number = 30,
): UsePageViewStatsResult {
  const [stats, setStats] = useState<PageViewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    adminApi
      .get<PageViewStats>('/page-views/stats', { params: { page, days } })
      .then(({ data }) => {
        if (!cancelled) setStats(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'Erreur inconnue')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [page, days, tick])

  return { stats, loading, error, refetch: () => setTick((t) => t + 1) }
}