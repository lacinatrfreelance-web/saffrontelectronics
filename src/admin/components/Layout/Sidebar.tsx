import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Tag,
  MessageSquare,
  FileText,
  Settings,
  ShoppingBag,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Produits' },
  { to: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { to: '/admin/promotions', icon: Tag, label: 'Promotions' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/admin/pages', icon: FileText, label: 'Pages' },
  { to: '/admin/settings', icon: Settings, label: 'Parametres' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-secondary-900 z-30
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-secondary-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <ShoppingBag size={16} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-sm leading-none block">
                Saffron
              </span>
              <span className="text-xs text-secondary-400 leading-none">Administration</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-secondary-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-secondary-400 hover:text-white hover:bg-secondary-800'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar