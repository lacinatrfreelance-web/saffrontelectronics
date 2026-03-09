export interface AdminUser {
  id: number
  name: string
  email: string
  role: string
}

export interface AuthState {
  user: AdminUser | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AdminContact {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  is_read: boolean
  is_replied: boolean
  reply: string | null
  replied_at: string | null
  created_at: string
}

export interface AdminProduct {
  id: number
  name: string
  slug: string
  description: string
  short_description: string | null
  price: number
  promotional_price: number | null
  images: string[]
  category_id: number
  brand: string | null
  model: string | null
  reference: string | null
  sku: string | null
  stock: number
  is_new: boolean
  is_featured: boolean
  is_promotion: boolean
  is_active: boolean
  specifications: Record<string, string> | null
  meta_title: string | null
  meta_description: string | null
}

export interface DashboardStats {
  total_products: number
  active_products: number
  total_categories: number
  total_promotions: number
  active_promotions: number
  unread_messages: number
  total_messages: number
  recent_products: AdminProduct[]
  recent_messages: AdminContact[]
}

export interface AdminPage {
  id: number
  title: string
  slug: string
  content: string
  meta_title: string | null
  meta_description: string | null
  is_published: boolean
}