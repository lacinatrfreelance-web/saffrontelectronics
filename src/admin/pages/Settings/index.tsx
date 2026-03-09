import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Save, Building2, Phone, Globe, Search, Lock } from 'lucide-react'
import { adminApi } from '@/services/api'
import { ADMIN_ENDPOINTS } from '@/services/endpoints'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'social', label: 'Reseaux sociaux', icon: Globe },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'account', label: 'Mon compte', icon: Lock },
] as const

type TabId = typeof TABS[number]['id']

export const AdminSettingsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<TabId>('general')

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await adminApi.get(ADMIN_ENDPOINTS.SETTINGS)
      return data.data
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const res = await adminApi.put(ADMIN_ENDPOINTS.SETTINGS, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      toast.success('Parametres sauvegardes')
    },
    onError: () => toast.error('Erreur lors de la sauvegarde'),
  })

  const passwordMutation = useMutation({
    mutationFn: async (data: { current_password: string; new_password: string; new_password_confirmation: string }) => {
      const res = await adminApi.post(ADMIN_ENDPOINTS.CHANGE_PASSWORD, data)
      return res.data
    },
    onSuccess: () => toast.success('Mot de passe modifie'),
    onError: (error: any) => toast.error(error.response?.data?.message || 'Erreur'),
  })

  const { register: registerGeneral, handleSubmit: handleGeneral } = useForm({
    values: settings ? {
      company_name: settings.company?.company_name || '',
      company_slogan: settings.company?.company_slogan || '',
    } : undefined,
  })

  const { register: registerContact, handleSubmit: handleContact } = useForm({
    values: settings ? {
      company_phone: settings.contact?.phone || '',
      company_email: settings.contact?.email || '',
      company_whatsapp: settings.contact?.whatsapp || '',
      company_address: settings.address?.company_address || '',
    } : undefined,
  })

  const { register: registerSocial, handleSubmit: handleSocial } = useForm({
    values: settings ? {
      facebook_url: settings.social?.facebook_url || '',
      instagram_url: settings.social?.instagram_url || '',
      twitter_url: settings.social?.twitter_url || '',
    } : undefined,
  })

  const { register: registerSeo, handleSubmit: handleSeo } = useForm({
    values: settings ? {
      meta_title: settings.seo?.title || '',
      meta_description: settings.seo?.description || '',
      meta_keywords: settings.seo?.keywords || '',
    } : undefined,
  })

  const { register: registerPassword, handleSubmit: handlePassword, reset: resetPassword } = useForm<{
    current_password: string
    new_password: string
    new_password_confirmation: string
  }>()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-secondary-100 rounded w-48 animate-pulse" />
        <div className="h-64 bg-secondary-100 rounded-2xl animate-pulse" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-secondary-900">Parametres</h1>
        <p className="text-secondary-500 text-sm mt-1">Configuration de votre boutique</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab navigation */}
        <div className="lg:w-52 shrink-0">
          <nav className="bg-white rounded-2xl border border-secondary-100 p-2 flex flex-row lg:flex-col gap-0.5 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1 bg-white rounded-2xl border border-secondary-100 p-6">
          {activeTab === 'general' && (
            <form onSubmit={handleGeneral((data) => updateMutation.mutate(data))}>
              <h2 className="font-semibold text-secondary-900 mb-5">Informations generales</h2>
              <div className="flex flex-col gap-4 max-w-lg">
                <Input label="Nom de la societe" {...registerGeneral('company_name')} />
                <Input label="Slogan" {...registerGeneral('company_slogan')} />
              </div>
              <div className="mt-6 pt-5 border-t border-secondary-100">
                <Button type="submit" icon={<Save size={14} />} loading={updateMutation.isPending}>
                  Sauvegarder
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'contact' && (
            <form onSubmit={handleContact((data) => updateMutation.mutate(data))}>
              <h2 className="font-semibold text-secondary-900 mb-5">Coordonnees</h2>
              <div className="flex flex-col gap-4 max-w-lg">
                <Input label="Telephone" placeholder="+225 27 22 47 40 44" {...registerContact('company_phone')} />
                <Input label="Email" type="email" placeholder="info@saffronelectronics.net" {...registerContact('company_email')} />
                <Input label="WhatsApp" placeholder="+225 07 00 00 00 00" {...registerContact('company_whatsapp')} />
                <Textarea label="Adresse" rows={2} {...registerContact('company_address')} />
              </div>
              <div className="mt-6 pt-5 border-t border-secondary-100">
                <Button type="submit" icon={<Save size={14} />} loading={updateMutation.isPending}>
                  Sauvegarder
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'social' && (
            <form onSubmit={handleSocial((data) => updateMutation.mutate(data))}>
              <h2 className="font-semibold text-secondary-900 mb-5">Reseaux sociaux</h2>
              <div className="flex flex-col gap-4 max-w-lg">
                <Input label="Facebook URL" placeholder="https://facebook.com/votrepage" {...registerSocial('facebook_url')} />
                <Input label="Instagram URL" placeholder="https://instagram.com/votrepage" {...registerSocial('instagram_url')} />
                <Input label="Twitter/X URL" placeholder="https://twitter.com/votrepage" {...registerSocial('twitter_url')} />
              </div>
              <div className="mt-6 pt-5 border-t border-secondary-100">
                <Button type="submit" icon={<Save size={14} />} loading={updateMutation.isPending}>
                  Sauvegarder
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'seo' && (
            <form onSubmit={handleSeo((data) => updateMutation.mutate(data))}>
              <h2 className="font-semibold text-secondary-900 mb-5">Referencement (SEO)</h2>
              <div className="flex flex-col gap-4 max-w-lg">
                <Input
                  label="Meta titre par defaut"
                  placeholder="Saffron Electronics CI - Electromenager Abidjan"
                  {...registerSeo('meta_title')}
                />
                <Textarea
                  label="Meta description par defaut"
                  placeholder="Votre specialiste en electromenager a Abidjan..."
                  rows={3}
                  {...registerSeo('meta_description')}
                />
                <Input
                  label="Mots-cles"
                  placeholder="electromenager, abidjan, refrigerateur, climatiseur"
                  {...registerSeo('meta_keywords')}
                />
              </div>
              <div className="mt-6 pt-5 border-t border-secondary-100">
                <Button type="submit" icon={<Save size={14} />} loading={updateMutation.isPending}>
                  Sauvegarder
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'account' && (
            <form onSubmit={handlePassword((data) => {
              passwordMutation.mutate(data, { onSuccess: () => resetPassword() })
            })}>
              <h2 className="font-semibold text-secondary-900 mb-5">Changer le mot de passe</h2>
              <div className="flex flex-col gap-4 max-w-sm">
                <Input
                  label="Mot de passe actuel"
                  type="password"
                  placeholder="••••••••"
                  required
                  {...registerPassword('current_password')}
                />
                <Input
                  label="Nouveau mot de passe"
                  type="password"
                  placeholder="••••••••"
                  required
                  {...registerPassword('new_password')}
                />
                <Input
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  placeholder="••••••••"
                  required
                  {...registerPassword('new_password_confirmation')}
                />
              </div>
              <div className="mt-6 pt-5 border-t border-secondary-100">
                <Button type="submit" icon={<Save size={14} />} loading={passwordMutation.isPending}>
                  Modifier le mot de passe
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminSettingsPage