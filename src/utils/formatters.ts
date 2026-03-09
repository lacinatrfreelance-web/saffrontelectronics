/// <reference types="vite/client" />

/**
 * Formate un prix en FCFA
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-CI', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA'
}

/**
 * Formate une date longue
 */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('fr-CI', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Formate une date courte
 */
export function formatDateShort(date: string): string {
  return new Intl.DateTimeFormat('fr-CI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Tronque un texte
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Calcule le temps restant d'une promotion
 */
export function getCountdown(endDate: string): {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
} {
  const end = new Date(endDate).getTime()
  const now = Date.now()
  const diff = end - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    expired: false,
  }
}

/**
 * Retourne l'URL complète d'une image stockée dans Laravel storage.
 *
 * Cas gérés :
 *  - URL déjà complète (http/https) → retournée directement
 *  - Chemin relatif (ex: "categories/img.jpg", "products/img.jpg") → préfixé avec base/storage/
 *  - Valeur vide / null → fallback
 */
export function getImageUrl(
  image: string | null | undefined,
  fallback = '/placeholder.jpg'
): string {
  if (!image || image.trim() === '') return fallback

  // URL complète retournée par un Resource Laravel → on retourne directement
  if (image.startsWith('http://') || image.startsWith('https://')) return image

  // Chemin relatif stocké en BDD (ex: "categories/abc.jpg" ou "products/abc.jpg")
  const base = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/api.*$/, '')
  const path = image.startsWith('/') ? image.slice(1) : image
  return `${base}/storage/${path}`
}

/**
 * Slugify un texte
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}