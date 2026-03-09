import React from 'react'
import { Link } from 'react-router-dom'
import { Package, MessageSquare, ArrowRight, Clock } from 'lucide-react'
import { useDashboard } from '@/admin/hooks/useDashboard'
import { StatsCards } from '@/admin/components/Dashboard/StatsCards'
import { StatusBadge } from '@/admin/components/Common/StatusBadge'
import { HomeViewStats } from '@/admin/components/Dashboard/Homeviewstats'
import { formatPrice, formatDateShort } from '@/utils/formatters'

export const AdminDashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div>
        <div className="h-8 bg-secondary-100 rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-secondary-100 p-5 h-32 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-500 text-sm mt-1">Vue d'ensemble de votre boutique</p>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <StatsCards stats={stats} />
      </div>

      {/* Page views — home */}
      <div className="mb-6">
        <HomeViewStats days={30} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent products */}
        <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-100">
            <h2 className="font-semibold text-secondary-900 flex items-center gap-2">
              <Package size={16} className="text-primary-500" />
              Produits recents
            </h2>
            <Link
              to="/admin/products"
              className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-secondary-50">
            {stats.recent_products.length === 0 ? (
              <p className="text-secondary-400 text-sm p-5 text-center">Aucun produit</p>
            ) : (
              stats.recent_products.map((product) => (
                <div key={product.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg overflow-hidden shrink-0">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">{product.name}</p>
                    <p className="text-xs text-secondary-400">{formatPrice(product.price)}</p>
                  </div>
                  <StatusBadge status={product.is_active ? 'active' : 'inactive'} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent messages */}
        <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-100">
            <h2 className="font-semibold text-secondary-900 flex items-center gap-2">
              <MessageSquare size={16} className="text-primary-500" />
              Messages recents
              {stats.unread_messages > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                  {stats.unread_messages}
                </span>
              )}
            </h2>
            <Link
              to="/admin/messages"
              className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-secondary-50">
            {stats.recent_messages.length === 0 ? (
              <p className="text-secondary-400 text-sm p-5 text-center">Aucun message</p>
            ) : (
              stats.recent_messages.map((msg) => (
                <Link
                  key={msg.id}
                  to="/admin/messages"
                  className="flex items-start gap-3 px-5 py-3 hover:bg-secondary-50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${msg.is_read ? 'bg-secondary-300' : 'bg-primary-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${!msg.is_read ? 'font-semibold text-secondary-900' : 'text-secondary-700'}`}>
                        {msg.name}
                      </p>
                      <span className="text-xs text-secondary-400 shrink-0 flex items-center gap-1">
                        <Clock size={11} />
                        {formatDateShort(msg.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-500 truncate mt-0.5">{msg.subject}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage