import React from 'react'
import { Menu, LogOut, User } from 'lucide-react'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'

interface TopbarProps {
  onMenuToggle: () => void
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAdminAuth()

  return (
    <header className="bg-white border-b border-secondary-100 px-5 py-3.5 flex items-center justify-between">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-lg hover:bg-secondary-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={15} className="text-primary-600" />
          </div>
          <span className="font-medium text-secondary-700 hidden sm:block">
            {user?.name || 'Administrateur'}
          </span>
        </div>
        <button
          onClick={() => logout()}
          className="flex items-center gap-1.5 text-sm text-secondary-500 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
        >
          <LogOut size={15} />
          <span className="hidden sm:block">Deconnexion</span>
        </button>
      </div>
    </header>
  )
}

export default Topbar