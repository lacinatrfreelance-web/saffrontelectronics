import { useMutation } from '@tanstack/react-query'
import { api } from '@/services/api'
import { ENDPOINTS } from '@/services/endpoints'
import type { ContactFormData } from '@/types/product.types'
import toast from 'react-hot-toast'

export function useContactForm() {
  return useMutation({
    mutationFn: async (formData: ContactFormData) => {
      const { data } = await api.post(ENDPOINTS.CONTACT, formData)
      return data
    },
    onSuccess: () => {
      toast.success('Votre message a ete envoye avec succes. Nous vous repondrons dans les plus brefs delais.')
    },
    onError: () => {
      toast.error('Une erreur est survenue. Veuillez reessayer.')
    },
  })
}