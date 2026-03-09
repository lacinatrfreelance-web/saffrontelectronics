import { useEffect, useRef } from 'react'
import { api } from '@/services/api'

const THROTTLE_MS = 5 * 60 * 1000 // 5 minutes
const STORAGE_KEY_PREFIX = 'pv_last_'

export function usePageView(page: string = 'home'): void {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) {
      console.log(`[PageView] 🚫 Bloqué — double montage React StrictMode (page: ${page})`)
      return
    }
    tracked.current = true

    const storageKey = `${STORAGE_KEY_PREFIX}${page}`
    const now = Date.now()
    const lastTracked = parseInt(localStorage.getItem(storageKey) ?? '0', 10)
    const elapsed = now - lastTracked
    const remainingMs = THROTTLE_MS - elapsed
    const remainingSec = Math.ceil(remainingMs / 1000)

    console.group(`[PageView] 📊 Vérification — page: "${page}"`)
    console.log('⏱  Dernier enregistrement :', lastTracked ? new Date(lastTracked).toLocaleTimeString('fr-FR') : 'jamais')
    console.log('⏳ Temps écoulé           :', lastTracked ? `${Math.floor(elapsed / 1000)}s` : '—')
    console.log('🎯 Seuil throttle         :', `${THROTTLE_MS / 1000}s (${THROTTLE_MS / 60000} min)`)

    if (elapsed < THROTTLE_MS) {
      console.log(`🔒 Throttle actif — prochain enregistrement dans ${remainingSec}s`)
      console.groupEnd()
      return
    }

    console.log('✅ Throttle OK — envoi de la vue...')
    console.groupEnd()

    api.post('/page-views/track', { page })
      .then(() => {
        localStorage.setItem(storageKey, String(now))
        console.log(`[PageView] ✅ Vue enregistrée — page: "${page}" à ${new Date(now).toLocaleTimeString('fr-FR')}`)
        console.log(`[PageView] 🔜 Prochain enregistrement possible dans ${THROTTLE_MS / 60000} min`)
      })
      .catch((err) => {
        tracked.current = false // reset pour réessayer au prochain montage
        console.error(`[PageView] ❌ Erreur réseau — vue NON enregistrée (page: "${page}")`, err)
        console.warn('[PageView] 🔄 Le timestamp n\'a PAS été mis à jour → réessai au prochain montage')
      })
  }, [page])
}