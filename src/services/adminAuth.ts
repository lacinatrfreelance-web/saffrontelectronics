import { adminApi } from './api'
import { ADMIN_ENDPOINTS } from './endpoints'
import { ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from '@/utils/constants'
import type { AdminUser, LoginCredentials } from '@/admin/types/admin.types'

export const adminAuth = {
  async login(credentials: LoginCredentials): Promise<{ user: AdminUser; token: string }> {
    const response = await adminApi.post(ADMIN_ENDPOINTS.LOGIN, credentials)
    const { user, token } = response.data

    localStorage.setItem(ADMIN_TOKEN_KEY, token)
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user))

    return { user, token }
  },

  async logout(): Promise<void> {
    try {
      await adminApi.post(ADMIN_ENDPOINTS.LOGOUT)
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem(ADMIN_TOKEN_KEY)
      localStorage.removeItem(ADMIN_USER_KEY)
    }
  },

  getToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY)
  },

  getUser(): AdminUser | null {
    const user = localStorage.getItem(ADMIN_USER_KEY)
    return user ? JSON.parse(user) : null
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}