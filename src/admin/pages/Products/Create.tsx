import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { ProductForm } from './components/ProductForm'
import { useCreateProduct } from '@/admin/hooks/useProductsAdmin'

export const AdminProductCreatePage: React.FC = () => {
  const navigate = useNavigate()
  const { mutate: createProduct, isPending } = useCreateProduct()

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
    // - Les suivants vont dans images[] (galerie, clé attendue par store())
    if (files.length > 0) {
      formData.append('main_image', files[0])
      files.slice(1).forEach((file, i) => {
        formData.append(`images[${i}]`, file)
      })
    }

    createProduct(formData, {
      onSuccess: () => navigate('/admin/products'),
    })
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
        <h1 className="font-display text-2xl font-bold text-secondary-900">Nouveau produit</h1>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitLabel="Créer le produit"
      />
    </div>
  )
}

export default AdminProductCreatePage