import React, { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, FolderOpen, Upload, X, ImageOff } from 'lucide-react'
import { adminApi } from '@/services/api'
import { ADMIN_ENDPOINTS } from '@/services/endpoints'
import { StatusBadge } from '@/admin/components/Common/StatusBadge'
import { ConfirmModal } from '@/admin/components/Common/ConfirmModal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getImageUrl } from '@/utils/formatters'
import toast from 'react-hot-toast'

export const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await adminApi.get(ADMIN_ENDPOINTS.CATEGORIES)
      return data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string; description: string; image?: File }) => {
      const formPayload = new FormData()
      formPayload.append('name', payload.name)
      if (payload.description) formPayload.append('description', payload.description)
      if (payload.image) formPayload.append('image', payload.image)
      const res = await adminApi.post(ADMIN_ENDPOINTS.CATEGORIES, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      toast.success('Catégorie créée')
      handleCloseCreateForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: number; name: string; description: string; image?: File }) => {
      const formPayload = new FormData()
      formPayload.append('_method', 'PUT')
      formPayload.append('name', payload.name)
      if (payload.description) formPayload.append('description', payload.description)
      if (payload.image) formPayload.append('image', payload.image)
      const res = await adminApi.post(ADMIN_ENDPOINTS.CATEGORY(payload.id), formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      toast.success('Catégorie mise à jour')
      handleCloseEditForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await adminApi.delete(ADMIN_ENDPOINTS.CATEGORY(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setDeleteId(null)
      toast.success('Catégorie supprimée')
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (ref: React.RefObject<HTMLInputElement>) => {
    setImageFile(null)
    setImagePreview(null)
    if (ref.current) ref.current.value = ''
  }

  const handleCloseCreateForm = () => {
    setShowForm(false)
    setFormData({ name: '', description: '' })
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleOpenEdit = (cat: any) => {
    setShowForm(false)
    setEditingCategory(cat)
    setFormData({ name: cat.name, description: cat.description || '' })
    setImageFile(null)
    setImagePreview(cat.image || null)
  }

  const handleCloseEditForm = () => {
    setEditingCategory(null)
    setFormData({ name: '', description: '' })
    setImageFile(null)
    setImagePreview(null)
    if (editFileInputRef.current) editFileInputRef.current.value = ''
  }

  const handleSubmitCreate = () => {
    if (!formData.name.trim()) { toast.error('Le nom est requis'); return }
    createMutation.mutate({ ...formData, image: imageFile ?? undefined })
  }

  const handleSubmitEdit = () => {
    if (!formData.name.trim()) { toast.error('Le nom est requis'); return }
    updateMutation.mutate({ id: editingCategory.id, ...formData, image: imageFile ?? undefined })
  }

  const categories = data?.data || []

  // Thumbnail générique quand pas d'image
  const NoImage = () => (
    <div className="w-full h-full flex items-center justify-center bg-secondary-100">
      <ImageOff size={14} className="text-secondary-300" />
    </div>
  )

  // Composant image avec fallback
  const CategoryThumbnail = ({ image, name }: { image: string | null; name: string }) => {
    const [broken, setBroken] = useState(false)
    if (!image || broken) return <NoImage />
    return (
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setBroken(true)}
      />
    )
  }

  // Champ upload image partagé
  const ImageUploadField = ({
    preview,
    inputRef,
    onRemove,
  }: {
    preview: string | null
    inputRef: React.RefObject<HTMLInputElement>
    onRemove: () => void
  }) => (
    <div>
      <label className="block text-sm font-medium text-secondary-700 mb-1.5">
        Image <span className="text-secondary-400 font-normal">(optionnel)</span>
      </label>
      {preview ? (
        <div className="flex items-end gap-3">
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Aperçu"
              className="w-24 h-24 rounded-xl object-cover border border-secondary-200"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
            >
              <X size={11} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-secondary-200 text-secondary-500 text-xs hover:border-primary-400 hover:text-primary-500 hover:bg-primary-50 transition-all mb-0.5"
          >
            <Upload size={12} /> Changer
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-dashed border-secondary-300 text-secondary-500 text-sm hover:border-primary-400 hover:text-primary-500 hover:bg-primary-50 transition-all"
        >
          <Upload size={15} />
          Choisir une image
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-secondary-900">Catégories</h1>
          <p className="text-secondary-500 text-sm mt-1">{categories.length} catégories</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => { setEditingCategory(null); setShowForm(true) }}>
          Nouvelle catégorie
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-primary-200 p-5 mb-5">
          <h3 className="font-semibold text-secondary-900 mb-4">Nouvelle catégorie</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label="Nom"
              placeholder="Nom de la catégorie"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Description"
              placeholder="Description (optionnel)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <ImageUploadField
              preview={imagePreview}
              inputRef={fileInputRef}
              onRemove={() => handleRemoveImage(fileInputRef)}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSubmitCreate} loading={createMutation.isPending}>Créer</Button>
            <Button variant="secondary" onClick={handleCloseCreateForm}>Annuler</Button>
          </div>
        </div>
      )}

      {/* Edit form */}
      {editingCategory && (
        <div className="bg-white rounded-2xl border border-primary-200 p-5 mb-5">
          <h3 className="font-semibold text-secondary-900 mb-4">
            Modifier — <span className="text-primary-500">{editingCategory.name}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label="Nom"
              placeholder="Nom de la catégorie"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Description"
              placeholder="Description (optionnel)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <ImageUploadField
              preview={imagePreview}
              inputRef={editFileInputRef}
              onRemove={() => handleRemoveImage(editFileInputRef)}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSubmitEdit} loading={updateMutation.isPending}>Enregistrer</Button>
            <Button variant="secondary" onClick={handleCloseEditForm}>Annuler</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-secondary-100">
            <tr>
              <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3">Catégorie</th>
              <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Produits</th>
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
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-16">
                  <FolderOpen size={40} className="text-secondary-200 mx-auto mb-3" />
                  <p className="text-secondary-500 text-sm">Aucune catégorie</p>
                </td>
              </tr>
            ) : (
              categories.map((cat: any) => (
                <tr
                  key={cat.id}
                  className={`hover:bg-secondary-50 transition-colors ${editingCategory?.id === cat.id ? 'bg-primary-50/50' : ''}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail — toujours l'image, jamais l'icône dossier */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-secondary-100">
                        <CategoryThumbnail image={cat.image} name={cat.name} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900">{cat.name}</p>
                        {cat.description && (
                          <p className="text-xs text-secondary-400 truncate max-w-xs">{cat.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-secondary-600">
                      {cat.products_count ?? '-'} produits
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={cat.is_active ? 'active' : 'inactive'} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className={`p-1.5 rounded-lg transition-all ${
                          editingCategory?.id === cat.id
                            ? 'text-primary-500 bg-primary-100'
                            : 'text-secondary-400 hover:text-primary-500 hover:bg-primary-50'
                        }`}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(cat.id)}
                        className="p-1.5 rounded-lg text-secondary-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Supprimer la catégorie"
        message="Cette action est irréversible. Les produits associés ne seront pas supprimés."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
        confirmLabel="Supprimer"
      />
    </div>
  )
}

export default AdminCategoriesPage