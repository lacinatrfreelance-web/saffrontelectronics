import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Minus, ChevronDown, ImageOff } from 'lucide-react'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/admin/components/Common/ImageUpload'
import { useCategories } from '@/hooks/useCategories'
import { getImageUrl } from '@/utils/formatters'

const schema = z.object({
  name: z.string().min(2, 'Nom requis'),
  description: z.string().min(10, 'Description requise'),
  short_description: z.string().optional(),
  price: z.number().positive('Prix invalide'),
  promotional_price: z.number().optional().nullable(),
  category_id: z.number({ required_error: 'Categorie requise' }),
  brand: z.string().optional(),
  model: z.string().optional(),
  reference: z.string().optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0, 'Stock invalide'),
  is_new: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  is_promotion: z.boolean().default(false),
  is_active: z.boolean().default(true),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
})

type ProductFormData = z.infer<typeof schema>

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>
  existingImages?: string[]
  onSubmit: (data: ProductFormData, files: File[], removedImageIndexes: number[]) => void
  isLoading?: boolean
  submitLabel?: string
}

// ─── Défini EN DEHORS — même pattern que CategoryThumbnail dans AdminCategoriesPage ───

const CategoryThumb: React.FC<{ image: string | null | undefined; name: string; size: number }> = ({
  image,
  name,
  size,
}) => {
  const [broken, setBroken] = useState(false)
  const url = image ? getImageUrl(image) : null

  if (!url || broken) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded flex items-center justify-center bg-secondary-100 shrink-0"
      >
        <ImageOff size={Math.round(size * 0.45)} className="text-secondary-300" />
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={name}
      style={{ width: size, height: size }}
      className="rounded object-cover shrink-0"
      onError={() => setBroken(true)}
    />
  )
}

// ─── Select catégorie custom avec images ────────────────────────────────────────

const CategorySelect: React.FC<{
  categories: Array<{ id: number; name: string; image?: string | null }>
  value: number | ''
  onChange: (id: number) => void
  error?: string
}> = ({ categories, value, onChange, error }) => {
  const [open, setOpen] = useState(false)
  const selected = categories.find((c) => c.id === value) ?? null

  return (
    <div className="relative">
      <label className="text-sm font-medium text-secondary-700 mb-1 block">
        Catégorie <span className="text-red-500">*</span>
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm text-left bg-white transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          error ? 'border-red-400' : 'border-secondary-200'
        } ${open ? 'ring-2 ring-primary-500 border-primary-500' : ''}`}
      >
        {selected ? (
          <>
            <CategoryThumb image={selected.image} name={selected.name} size={24} />
            <span className="flex-1 text-secondary-900">{selected.name}</span>
          </>
        ) : (
          <span className="flex-1 text-secondary-400">Sélectionnez une catégorie</span>
        )}
        <ChevronDown
          size={16}
          className={`text-secondary-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-secondary-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
            {categories.length === 0 ? (
              <p className="px-4 py-3 text-sm text-secondary-400 text-center">Aucune catégorie</p>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { onChange(cat.id); setOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-secondary-50 transition-colors ${
                    value === cat.id ? 'bg-primary-50 text-primary-600' : 'text-secondary-800'
                  }`}
                >
                  <CategoryThumb image={cat.image} name={cat.name} size={28} />
                  <span className="flex-1">{cat.name}</span>
                  {value === cat.id && (
                    <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────

export const ProductForm: React.FC<ProductFormProps> = ({
  defaultValues,
  existingImages = [],
  onSubmit,
  isLoading = false,
  submitLabel = 'Enregistrer',
}) => {
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [removedIndexes, setRemovedIndexes] = useState<number[]>([])
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }])
  const [activeTab, setActiveTab] = useState<'general' | 'media' | 'seo'>('general')

  const { data: categories } = useCategories()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      is_active: true,
      is_new: false,
      is_featured: false,
      is_promotion: false,
      stock: 0,
      ...defaultValues,
    },
  })

  const isPromotion = watch('is_promotion')
  const categoryId = watch('category_id')

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data, newFiles, removedIndexes)
  }

  const TABS = [
    { id: 'general', label: 'Informations' },
    { id: 'media', label: 'Images' },
    { id: 'seo', label: 'SEO' },
  ] as const

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Tabs */}
      <div className="flex gap-1 bg-secondary-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-secondary-900 shadow-sm'
                : 'text-secondary-500 hover:text-secondary-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General tab */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-secondary-100 p-5">
              <h3 className="font-semibold text-secondary-900 mb-4">Informations de base</h3>
              <div className="flex flex-col gap-4">
                <Input
                  label="Nom du produit"
                  placeholder="Ex: Refrigerateur Samsung 300L"
                  required
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Textarea
                  label="Description courte"
                  placeholder="Courte description du produit..."
                  rows={2}
                  {...register('short_description')}
                />
                <Textarea
                  label="Description complete"
                  placeholder="Description detaillee du produit..."
                  rows={5}
                  required
                  error={errors.description?.message}
                  {...register('description')}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-secondary-100 p-5">
              <h3 className="font-semibold text-secondary-900 mb-4">Prix et stock</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prix (FCFA)"
                  type="number"
                  placeholder="0"
                  required
                  error={errors.price?.message}
                  {...register('price', { valueAsNumber: true })}
                />
                <Input
                  label="Stock"
                  type="number"
                  placeholder="0"
                  required
                  error={errors.stock?.message}
                  {...register('stock', { valueAsNumber: true })}
                />
                {isPromotion && (
                  <Input
                    label="Prix promotionnel (FCFA)"
                    type="number"
                    placeholder="0"
                    error={errors.promotional_price?.message}
                    {...register('promotional_price', { valueAsNumber: true })}
                  />
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl border border-secondary-100 p-5">
              <h3 className="font-semibold text-secondary-900 mb-4">Specifications techniques</h3>
              <div className="flex flex-col gap-2">
                {specs.map((spec, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="Caracteristique (ex: Capacite)"
                      value={spec.key}
                      onChange={(e) => {
                        const updated = [...specs]
                        updated[i].key = e.target.value
                        setSpecs(updated)
                      }}
                    />
                    <Input
                      placeholder="Valeur (ex: 300L)"
                      value={spec.value}
                      onChange={(e) => {
                        const updated = [...specs]
                        updated[i].value = e.target.value
                        setSpecs(updated)
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setSpecs(specs.filter((_, j) => j !== i))}
                      className="p-2.5 text-secondary-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setSpecs([...specs, { key: '', value: '' }])}
                  className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 mt-1"
                >
                  <Plus size={14} />
                  Ajouter une specification
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-secondary-100 p-5">
              <h3 className="font-semibold text-secondary-900 mb-4">Classification</h3>
              <div className="flex flex-col gap-3">
                <CategorySelect
                  categories={categories ?? []}
                  value={categoryId ?? ''}
                  onChange={(id) => setValue('category_id', id, { shouldValidate: true })}
                  error={errors.category_id?.message}
                />
                <Input label="Marque" placeholder="Ex: Samsung" {...register('brand')} />
                <Input label="Modele" placeholder="Ex: RT38K5400S8" {...register('model')} />
                <Input label="Reference" placeholder="Ref interne" {...register('reference')} />
                <Input label="SKU" placeholder="SKU" {...register('sku')} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-secondary-100 p-5">
              <h3 className="font-semibold text-secondary-900 mb-4">Options</h3>
              <div className="flex flex-col gap-3">
                {[
                  { field: 'is_active' as const, label: 'Produit actif' },
                  { field: 'is_new' as const, label: 'Nouveau produit' },
                  { field: 'is_featured' as const, label: 'Produit en vedette' },
                  { field: 'is_promotion' as const, label: 'En promotion' },
                ].map(({ field, label }) => (
                  <label key={field} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-primary-500"
                      {...register(field)}
                    />
                    <span className="text-sm text-secondary-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media tab */}
      {activeTab === 'media' && (
        <div className="bg-white rounded-2xl border border-secondary-100 p-5">
          <h3 className="font-semibold text-secondary-900 mb-4">Images du produit</h3>
          <ImageUpload
            onFilesChange={setNewFiles}
            existingImages={existingImages.filter((_, i) => !removedIndexes.includes(i))}
            onRemoveExisting={(i) => setRemovedIndexes([...removedIndexes, i])}
            maxFiles={8}
          />
        </div>
      )}

      {/* SEO tab */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-2xl border border-secondary-100 p-5">
          <h3 className="font-semibold text-secondary-900 mb-4">SEO</h3>
          <div className="flex flex-col gap-4 max-w-2xl">
            <Input
              label="Meta titre"
              placeholder="Titre SEO (60 caracteres max)"
              {...register('meta_title')}
            />
            <Textarea
              label="Meta description"
              placeholder="Description SEO (160 caracteres max)"
              rows={3}
              {...register('meta_description')}
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-secondary-100">
        <Button type="submit" loading={isLoading} size="lg">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default ProductForm