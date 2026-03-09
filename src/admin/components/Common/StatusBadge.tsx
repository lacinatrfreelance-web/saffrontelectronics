import React from 'react'

type Status = 'active' | 'inactive' | 'promotion' | 'new' | 'read' | 'unread' | 'replied'

interface StatusBadgeProps {
  status: Status
  label?: string
}

const STATUS_CONFIG: Record<Status, { bg: string; text: string; dot: string; defaultLabel: string }> = {
  active: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', defaultLabel: 'Actif' },
  inactive: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', defaultLabel: 'Inactif' },
  promotion: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', defaultLabel: 'Promotion' },
  new: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', defaultLabel: 'Nouveau' },
  read: { bg: 'bg-secondary-100', text: 'text-secondary-600', dot: 'bg-secondary-400', defaultLabel: 'Lu' },
  unread: { bg: 'bg-primary-100', text: 'text-primary-700', dot: 'bg-primary-500', defaultLabel: 'Non lu' },
  replied: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', defaultLabel: 'Repondu' },
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const config = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {label || config.defaultLabel}
    </span>
  )
}

export default StatusBadge