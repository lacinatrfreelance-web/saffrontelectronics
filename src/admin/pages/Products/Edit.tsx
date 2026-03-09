import React from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { ProductForm } from './components/ProductForm'
import { useAdminProduct, useUpdateProduct } from '@/admin/hooks/useProductsAdmin'
import { getImageUrl } from '@/utils/formatters'

export const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const productId = Number(id)

  const { data: product, isLoading } = useAdminProduct(productId)
  const { mutate: updateProduct, isPending } = useUpdateProduct(productId)

  const handleSubmit = (data: any, files: File[], removedIndexes: number[]) => {
    const formData = new FormData()

    // Champs texte / nombres / booléens
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value))
      }
    })

    // Specifications (objet → JSON string)
    if (data.specifications && typeof data.specifications === 'object') {
      formData.set('specifications', JSON.stringify(data.specifications))
    }

    // Images :
    // - Le premier fichier devient main_image
    // - Les suivants vont dans new_images[] (galerie)
    if (files.length > 0) {
      formData.append('main_image', files[0])
      files.slice(1).forEach((file, i) => {
        formData.append(`new_images[${i}]`, file)
      })
    }

    // Images existantes à supprimer
    removedIndexes.forEach((i) => {
      formData.append('removed_images[]', String(i))
    })

    updateProduct(formData, {
      onSuccess: () => navigate('/admin/products'),
    })
  }

  if (isLoading) {
    return <div className="h-96 bg-secondary-100 rounded-2xl animate-pulse" />
  }

  if (!product) {
    return <p className="text-secondary-500">Produit non trouvé</p>
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-secondary-500 hover:text-secondary-900 mb-3 transition-colors"
        >
          <ChevronLeft size={15} />
          Retour aux produits
        </Link>
        <h1 className="font-display text-2xl font-bold text-secondary-900">
          Modifier : {product.name}
        </h1>
      </div>

      <ProductForm
        defaultValues={{
          name: product.name,
          description: product.description,
          short_description: product.short_description || '',
          price: product.price,
          promotional_price: product.promotional_price ?? undefined,
          category_id: product.category_id,
          brand: product.brand || '',
          model: product.model || '',
          reference: product.reference || '',
          sku: product.sku || '',
          stock: product.stock,
          is_new: product.is_new,
          is_featured: product.is_featured,
          is_promotion: product.is_promotion,
          is_active: product.is_active,
          meta_title: product.meta_title || '',
          meta_description: product.meta_description || '',
        }}
        // images est déjà en URLs complètes depuis ProductResource
        existingImages={product.images ?? []}
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitLabel="Mettre à jour"
      />
    </div>
  )
}

export default AdminProductEditPage