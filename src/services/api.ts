import axios from 'axios'
import { ADMIN_TOKEN_KEY } from '@/utils/constants'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:8000/api/admin',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Intercepteur requetes admin - ajout token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Intercepteur reponses admin - deconnexion auto si 401
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(ADMIN_TOKEN_KEY)
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export { api, adminApi }
export default api