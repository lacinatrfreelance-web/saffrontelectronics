import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit2, Trash2, Tag, Calendar, Package, X, Search } from 'lucide-react'
import { adminApi } from '@/services/api'
import { ADMIN_ENDPOINTS } from '@/services/endpoints'
import { StatusBadge } from '@/admin/components/Common/StatusBadge'
import { ConfirmModal } from '@/admin/components/Common/ConfirmModal'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { formatDate } from '@/utils/formatters'
import toast from 'react-hot-toast'

const schema = z.object({
  title: z.string().min(2, 'Titre requis'),
  description: z.string().optional(),
  discount_percentage: z.number().min(1).max(100),
  start_date: z.string(),
  end_date: z.string(),
  is_active: z.boolean().default(true),
  product_ids: z.array(z.number()).default([]),
})

type PromoForm = z.infer<typeof schema>

export const AdminPromotionsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPromo, setEditingPromo] = useState<any | null>(null)
  const [productSearch, setProductSearch] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])

  // Récupération des promotions
  const { data, isLoading } = useQuery({
    queryKey: ['admin-promotions'],
    queryFn: async () => {
      const { data } = await adminApi.get(ADMIN_ENDPOINTS.PROMOTIONS)
      return data
    },
  })

  // Récupération de tous les produits pour le sélecteur
  const { data: productsData } = useQuery({
    queryKey: ['admin-products-all'],
    queryFn: async () => {
      const { data } = await adminApi.get(ADMIN_ENDPOINTS.PRODUCTS + '?per_page=200')
      return data
    },
    enabled: showForm,
  })

  const allProducts: any[] = productsData?.data ?? []

  const filteredProducts = allProducts.filter((p: any) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.reference?.toLowerCase().includes(productSearch.toLowerCase())
  )

  const createMutation = useMutation({
    mutationFn: async (formData: PromoForm) => {
      const { data } = await adminApi.post(ADMIN_ENDPOINTS.PROMOTIONS, formData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] })
      toast.success('Promotion créée')
      closeForm()
    },
    onError: () => toast.error('Erreur lors de la création'),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PromoForm }) => {
      const res = await adminApi.put(ADMIN_ENDPOINTS.PROMOTION(id), data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] })
      toast.success('Promotion mise à jour')
      closeForm()
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await adminApi.delete(ADMIN_ENDPOINTS.PROMOTION(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] })
      setDeleteId(null)
      toast.success('Promotion supprimée')
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PromoForm>({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true, discount_percentage: 10, product_ids: [] },
  })

  const watchedProductIds: number[] = watch('product_ids') ?? []

  const closeForm = () => {
    setShowForm(false)
    setEditingPromo(null)
    setSelectedProducts([])
    setProductSearch('')
    reset()
  }

  const openEdit = (promo: any) => {
    setEditingPromo(promo)
    setValue('title', promo.title)
    setValue('description', promo.description || '')
    setValue('discount_percentage', promo.discount_percentage)
    setValue('start_date', promo.start_date?.slice(0, 10))
    setValue('end_date', promo.end_date?.slice(0, 10))
    setValue('is_active', promo.is_active)
    // Pré-sélectionner les produits déjà liés
    const linked = promo.products ?? []
    setSelectedProducts(linked)
    setValue('product_ids', linked.map((p: any) => p.id))
    setShowForm(true)
  }

  const toggleProduct = (product: any) => {
    const alreadySelected = watchedProductIds.includes(product.id)
    let newIds: number[]
    let newSelected: any[]

    if (alreadySelected) {
      newIds = watchedProductIds.filter((id) => id !== product.id)
      newSelected = selectedProducts.filter((p) => p.id !== product.id)
    } else {
      newIds = [...watchedProductIds, product.id]
      newSelected = [...selectedProducts, product]
    }

    setValue('product_ids', newIds)
    setSelectedProducts(newSelected)
  }

  const onSubmit = (formData: PromoForm) => {
    if (editingPromo) {
      updateMutation.mutate({ id: editingPromo.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const promotions = data?.data || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-secondary-900">Promotions</h1>
          <p className="text-secondary-500 text-sm mt-1">
            {promotions.length} promotion{promotions.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => { setEditingPromo(null); setShowForm(true); reset() }}
        >
          Nouvelle promotion
        </Button>
      </div>

      {/* ── Formulaire ── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-primary-200 p-5 mb-6">
          <h3 className="font-semibold text-secondary-900 mb-5">
            {editingPromo ? 'Modifier la promotion' : 'Nouvelle promotion'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Champs de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Titre"
                placeholder="Titre de la promotion"
                required
                error={errors.title?.message}
                {...register('title')}
              />
              <Input
                label="Remise (%)"
                type="number"
                placeholder="10"
                required
                error={errors.discount_percentage?.message}
                {...register('discount_percentage', { valueAsNumber: true })}
              />
              <Input
                label="Date de début"
                type="date"
                required
                error={errors.start_date?.message}
                {...register('start_date')}
              />
              <Input
                label="Date de fin"
                type="date"
                required
                error={errors.end_date?.message}
                {...register('end_date')}
              />
            </div>

            <div className="mb-4">
              <Textarea
                label="Description"
                placeholder="Description de la promotion"
                rows={2}
                {...register('description')}
              />
            </div>

            <div className="flex items-center gap-4 mb-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary-500" {...register('is_active')} />
                <span className="text-sm text-secondary-700">Promotion active</span>
              </label>
            </div>

            {/* ── Sélecteur de produits ── */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Produits associés
                <span className="ml-2 text-xs text-secondary-400 font-normal">
                  ({watchedProductIds.length} sélectionné{watchedProductIds.length > 1 ? 's' : ''})
                </span>
              </label>

              {/* Produits déjà sélectionnés */}
              {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedProducts.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full border border-primary-200"
                    >
                      {p.name}
                      <button
                        type="button"
                        onClick={() => toggleProduct(p)}
                        className="hover:text-primary-900 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Recherche + liste */}
              <div className="border border-secondary-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-secondary-100 bg-secondary-50">
                  <Search size={14} className="text-secondary-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="flex-1 text-sm bg-transparent outline-none text-secondary-700 placeholder-secondary-400"
                  />
                </div>
                <div className="max-h-52 overflow-y-auto divide-y divide-secondary-50">
                  {filteredProducts.length === 0 ? (
                    <div className="py-8 text-center">
                      <Package size={28} className="text-secondary-200 mx-auto mb-2" />
                      <p className="text-xs text-secondary-400">Aucun produit trouvé</p>
                    </div>
                  ) : (
                    filteredProducts.map((product: any) => {
                      const isSelected = watchedProductIds.includes(product.id)
                      return (
                        <label
                          key={product.id}
                          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                            isSelected ? 'bg-primary-50' : 'hover:bg-secondary-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProduct(product)}
                            className="w-4 h-4 accent-primary-500 shrink-0"
                          />
                          {product.main_image && (
                            <img
                              src={product.main_image}
                              alt={product.name}
                              className="w-8 h-8 rounded-lg object-cover border border-secondary-100 shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-secondary-800 truncate">{product.name}</p>
                            {product.reference && (
                              <p className="text-xs text-secondary-400">{product.reference}</p>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-secondary-600 shrink-0">
                            {product.price} DA
                          </span>
                        </label>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingPromo ? 'Mettre à jour' : 'Créer'}
              </Button>
              <Button type="button" variant="secondary" onClick={closeForm}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ── Table des promotions ── */}
      <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-secondary-100">
            <tr>
              <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3">Titre</th>
              <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3">Remise</th>
              <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Période</th>
              <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Produits</th>
              <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3">Statut</th>
              <th className="text-right text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-50">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-secondary-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : promotions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16">
                  <Tag size={36} className="text-secondary-200 mx-auto mb-3" />
                  <p className="text-secondary-500 text-sm">Aucune promotion</p>
                </td>
              </tr>
            ) : (
              promotions.map((promo: any) => (
                <tr key={promo.id} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-secondary-900">{promo.title}</p>
                    {promo.description && (
                      <p className="text-xs text-secondary-400 truncate max-w-xs mt-0.5">{promo.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-accent-100 text-accent-700 font-bold text-sm px-2.5 py-1 rounded-full">
                      -{promo.discount_percentage}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-secondary-500">
                      <Calendar size={12} />
                      {formatDate(promo.start_date)} → {formatDate(promo.end_date)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    {promo.products?.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5">
                          {promo.products.slice(0, 3).map((p: any) => (
                            <img
                              key={p.id}
                              src={p.main_image}
                              alt={p.name}
                              className="w-6 h-6 rounded-full object-cover border-2 border-white"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-secondary-500">
                          {promo.products.length} produit{promo.products.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-secondary-300 italic">Aucun produit</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={promo.is_active ? 'active' : 'inactive'} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(promo)}
                        className="p-1.5 rounded-lg text-secondary-400 hover:text-primary-500 hover:bg-primary-50 transition-all"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(promo.id)}
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
        title="Supprimer la promotion"
        message="Cette action est irréversible."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
        confirmLabel="Supprimer"
      />
    </div>
  )
}

export default AdminPromotionsPage