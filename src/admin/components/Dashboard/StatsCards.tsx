import React from 'react'
import { motion } from 'framer-motion'
import { Package, FolderOpen, Tag, MessageSquare } from 'lucide-react'
import type { DashboardStats } from '@/admin/types/admin.types'

interface StatsCardsProps {
  stats: DashboardStats
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      label: 'Total produits',
      value: stats?.total_products,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
      trend: `${stats?.active_products ?? 0} actifs`,
    },
    {
      label: 'Catégories',
      value: stats?.total_categories,
      icon: FolderOpen,
      color: 'bg-purple-100 text-purple-600',
      trend: 'Catégories actives',
    },
    {
      label: 'Promotions',
      value: stats?.total_promotions,
      icon: Tag,
      color: 'bg-orange-100 text-orange-600',
      trend: `${stats?.active_promotions ?? 0} en cours`,
    },
    {
      label: 'Messages',
      value: stats?.total_messages,
      icon: MessageSquare,
      color: 'bg-emerald-100 text-emerald-600',
      trend: `${stats?.unread_messages ?? 0} non lus`,
      alert: (stats?.unread_messages ?? 0) > 0,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.07 }}
          className="bg-white rounded-2xl border border-secondary-100 p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
              <card.icon size={20} />
            </div>
            {card.alert && (
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>

          <div className="font-display text-3xl font-bold text-secondary-900 mb-1">
            {card.value !== undefined && card.value !== null
              ? String(card.value)
              : '—'}
          </div>

          <div className="text-sm text-secondary-500">{card.label}</div>
          <div className={`text-xs mt-2 font-medium ${card.alert ? 'text-red-500' : 'text-secondary-400'}`}>
            {card.trend}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default StatsCards