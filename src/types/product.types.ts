export interface Category {
  id: number
  name: string
  slug: string
  image: string | null
  description: string | null
  is_active: boolean
  order: number
  products_count?: number
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  short_description?: string
  price: number
  promotional_price: number | null
  final_price: number
  discount_percentage: number
  images: string[]
  thumbnail: string | null
  category: Category
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
  views: number
  created_at: string
  updated_at: string
}

export interface Promotion {
  id: number
  title: string
  description: string | null
  discount_percentage: number
  start_date: string
  end_date: string
  is_active: boolean
  image: string | null
  products?: Product[]
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface Page {
  id: number
  title: string
  slug: string
  content: string
  meta_title: string | null
  meta_description: string | null
  is_published: boolean
}

export interface SiteSettings {
  company: Record<string, string>
  contact: {
    phone: string
    email: string
    whatsapp: string
  }
  address: Record<string, string>
  hours: Record<string, string>
  social: Record<string, string>
  seo: {
    title: string
    description: string
    keywords: string
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface HomeData {
  featured_categories: Category[]
  featured_products: Product[]
  new_products: Product[]
  sale_products: Product[]
  current_promotion: Promotion | null
}

export interface ProductFilters {
  search?: string
  category?: string
  brand?: string
  min_price?: number
  max_price?: number
  is_new?: boolean
  is_promotion?: boolean
  is_featured?: boolean
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}