import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit2, FileText, Save, X } from 'lucide-react'
import { adminApi } from '@/services/api'
import { ADMIN_ENDPOINTS } from '@/services/endpoints'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/admin/components/Common/StatusBadge'
import toast from 'react-hot-toast'

export const AdminPagesPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [editingPage, setEditingPage] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    meta_title: '',
    meta_description: '',
    is_published: true,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: async () => {
      const { data } = await adminApi.get(ADMIN_ENDPOINTS.PAGES)
      return data
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await adminApi.put(ADMIN_ENDPOINTS.PAGE(id), data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] })
      toast.success('Page mise a jour')
      setEditingPage(null)
    },
    onError: () => toast.error('Erreur lors de la mise a jour'),
  })

  const openEdit = (page: any) => {
    setEditingPage(page)
    setFormData({
      title: page.title,
      content: page.content,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      is_published: page.is_published,
    })
  }

  const pages = data?.data || []

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-secondary-900">Pages statiques</h1>
        <p className="text-secondary-500 text-sm mt-1">Gestion des pages de contenu du site</p>
      </div>

      {editingPage ? (
        /* Edit form */
        <div className="bg-white rounded-2xl border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-secondary-900 text-lg">Modifier: {editingPage.title}</h2>
            <button
              onClick={() => setEditingPage(null)}
              className="p-1.5 text-secondary-400 hover:text-secondary-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <Input
              label="Titre de la page"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div>
              <label className="text-sm font-medium text-secondary-700 mb-1 block">
                Contenu <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                placeholder="Contenu HTML de la page..."
              />
              <p className="text-xs text-secondary-400 mt-1">Vous pouvez utiliser du HTML dans ce champ.</p>
            </div>

            <div className="border-t border-secondary-100 pt-5">
              <h3 className="font-medium text-secondary-900 text-sm mb-3">SEO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Meta titre"
                  placeholder="Titre SEO (60 car. max)"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                />
                <Textarea
                  label="Meta description"
                  placeholder="Description SEO (160 car. max)"
                  rows={2}
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary-500"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
                <span className="text-sm text-secondary-700">Page publiee</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2 border-t border-secondary-100">
              <Button
                icon={<Save size={15} />}
                loading={updateMutation.isPending}
                onClick={() => updateMutation.mutate({ id: editingPage.id, data: formData })}
              >
                Enregistrer
              </Button>
              <Button variant="secondary" onClick={() => setEditingPage(null)}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Pages list */
        <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-100">
              <tr>
                <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3">Page</th>
                <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Slug</th>
                <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3">Statut</th>
                <th className="text-right text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-50">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-secondary-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <FileText size={36} className="text-secondary-200 mx-auto mb-3" />
                    <p className="text-secondary-500 text-sm">Aucune page</p>
                  </td>
                </tr>
              ) : (
                pages.map((page: any) => (
                  <tr key={page.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-secondary-100 rounded-lg flex items-center justify-center shrink-0">
                          <FileText size={15} className="text-secondary-400" />
                        </div>
                        <span className="text-sm font-medium text-secondary-900">{page.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <code className="text-xs bg-secondary-100 text-secondary-600 px-2 py-0.5 rounded">
                        /{page.slug}
                      </code>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={page.is_published ? 'active' : 'inactive'} label={page.is_published ? 'Publiee' : 'Brouillon'} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end">
                        <button
                          onClick={() => openEdit(page)}
                          className="p-1.5 rounded-lg text-secondary-400 hover:text-primary-500 hover:bg-primary-50 transition-all flex items-center gap-1.5 text-sm font-medium"
                        >
                          <Edit2 size={14} />
                          Modifier
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminPagesPage