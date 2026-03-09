import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react'
import { useAdminProducts, useDeleteProduct } from '@/admin/hooks/useProductsAdmin'
import { StatusBadge } from '@/admin/components/Common/StatusBadge'
import { ConfirmModal } from '@/admin/components/Common/ConfirmModal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatPrice, formatDateShort, getImageUrl } from '@/utils/formatters'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export const AdminProductsPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useAdminProducts(page, debouncedSearch)
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()

  const products = data?.data || []

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-secondary-900">Produits</h1>
          <p className="text-secondary-500 text-sm mt-1">
            {data?.total !== undefined ? `${data.total} produits au total` : ''}
          </p>
        </div>
        <Link to="/admin/products/create">
          <Button icon={<Plus size={16} />}>Nouveau produit</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden">
        <div className="p-4 border-b border-secondary-100">
          <div className="max-w-sm">
            <Input
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={15} />}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-100">
              <tr>
                <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3">Produit</th>
                <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Categorie</th>
                <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3">Prix</th>
                <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Stock</th>
                <th className="text-left text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3">Statut</th>
                <th className="text-right text-xs font-semibold text-secondary-500 uppercase tracking-wide px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-secondary-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Package size={40} className="text-secondary-200 mx-auto mb-3" />
                    <p className="text-secondary-500 text-sm">Aucun produit trouve</p>
                    <Link to="/admin/products/create" className="text-primary-500 text-sm mt-2 inline-block">
                      Creer le premier produit
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary-100 overflow-hidden shrink-0">
                          {product.images?.[0] && (
                            <img
                              src={getImageUrl(product.images[0])}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary-900 line-clamp-1">{product.name}</p>
                          {product.brand && (
                            <p className="text-xs text-secondary-400">{product.brand}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-secondary-600">{product.category?.name || '-'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="text-sm font-semibold text-secondary-900">{formatPrice(product.final_price || product.price)}</span>
                        {product.promotional_price && (
                          <p className="text-xs text-secondary-400 line-through">{formatPrice(product.price)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className={`text-sm font-medium ${product.stock <= 0 ? 'text-red-500' : product.stock <= 5 ? 'text-amber-500' : 'text-emerald-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        <StatusBadge status={product.is_active ? 'active' : 'inactive'} />
                        {product.is_promotion && <StatusBadge status="promotion" />}
                        {product.is_new && <StatusBadge status="new" />}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg text-secondary-400 hover:text-primary-500 hover:bg-primary-50 transition-all"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
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

        {/* Pagination */}
        {data && data.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-secondary-100">
            <p className="text-xs text-secondary-500">
              {data.from}-{data.to} sur {data.total} resultats
            </p>
            <div className="flex gap-1.5">
              {[...Array(data.last_page)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                    data.current_page === i + 1
                      ? 'bg-primary-500 text-white'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm delete */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Supprimer le produit"
        message="Cette action est irreversible. Le produit sera definitivement supprime."
        onConfirm={() => {
          if (deleteId) {
            deleteProduct(deleteId, { onSuccess: () => setDeleteId(null) })
          }
        }}
        onCancel={() => setDeleteId(null)}
        loading={isDeleting}
        confirmLabel="Supprimer"
      />
    </div>
  )
}

export default AdminProductsPage