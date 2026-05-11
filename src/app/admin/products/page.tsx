import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Plus, Edit, Package } from 'lucide-react'
import { formatPriceSimple } from '@/utils'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'

export const metadata: Metadata = { title: 'Products' }

interface ProductRow {
  id: string
  title: string
  slug: string
  price: number
  discount_price: number | null
  sku: string | null
  stock: number
  gender: string
  status: string
  categories: { name: string } | null
  product_images: Array<{ url: string; is_primary: boolean; sort_order: number }> | null
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const limit = 20
  const from = (page - 1) * limit

  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('id, title, slug, price, discount_price, sku, stock, gender, status, categories(name), product_images(url, is_primary, sort_order)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (params.status) {
    query = query.eq('status', params.status)
  }

  const { data, count } = await query
  const products = (data ?? []) as unknown as ProductRow[]
  const totalPages = Math.ceil((count ?? 0) / limit)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Products</h1>
          <p className="text-brand-gray text-sm mt-1">{count ?? 0} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {['All', 'active', 'draft', 'archived'].map((status) => (
          <Link
            key={status}
            href={status === 'All' ? '/admin/products' : `/admin/products?status=${status}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
              (status === 'All' && !params.status) || params.status === status
                ? 'bg-brand-pink text-black border-brand-pink'
                : 'border-white/10 text-brand-gray hover:text-white'
            }`}
          >
            {status}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-white/5 rounded-sm py-16 text-center">
          <Package className="w-12 h-12 mx-auto mb-3 text-brand-gray/20" />
          <p className="text-brand-gray">No products found</p>
          <Link href="/admin/products/new" className="btn-primary mt-4 inline-flex text-sm px-6 py-2.5">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-[#0d0d0d] border border-white/5 rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left px-4 py-3 text-xs text-brand-gray uppercase tracking-wide">Product</th>
                    <th className="text-left px-4 py-3 text-xs text-brand-gray uppercase tracking-wide">Category</th>
                    <th className="text-left px-4 py-3 text-xs text-brand-gray uppercase tracking-wide">Price</th>
                    <th className="text-left px-4 py-3 text-xs text-brand-gray uppercase tracking-wide">Stock</th>
                    <th className="text-left px-4 py-3 text-xs text-brand-gray uppercase tracking-wide">Gender</th>
                    <th className="text-left px-4 py-3 text-xs text-brand-gray uppercase tracking-wide">Status</th>
                    <th className="text-right px-4 py-3 text-xs text-brand-gray uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const sorted = [...(product.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
                    const primaryImage = sorted.find((img) => img.is_primary)?.url ?? sorted[0]?.url
                    return (
                      <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-12 flex-shrink-0 bg-white/5 rounded overflow-hidden">
                              {primaryImage ? (
                                <Image src={primaryImage} alt={product.title} fill className="object-cover" sizes="40px" />
                              ) : (
                                <Package className="w-4 h-4 text-brand-gray/30 absolute inset-0 m-auto" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-medium line-clamp-1">{product.title}</p>
                              <p className="text-brand-gray text-xs font-mono">{product.sku ?? '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-brand-gray">{product.categories?.name ?? '—'}</td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="text-white font-medium">
                              {formatPriceSimple(product.discount_price ?? product.price)}
                            </span>
                            {product.discount_price && (
                              <span className="text-brand-gray text-xs line-through ml-1.5">
                                {formatPriceSimple(product.price)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={product.stock <= 5 ? 'text-orange-400 font-medium' : 'text-white'}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-brand-gray capitalize">{product.gender}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full uppercase font-medium ${
                            product.status === 'active' ? 'bg-green-400/10 text-green-400'
                            : product.status === 'draft' ? 'bg-yellow-400/10 text-yellow-400'
                            : 'bg-gray-400/10 text-gray-400'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="p-1.5 text-brand-gray hover:text-white hover:bg-white/5 rounded transition-colors"
                              aria-label="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <DeleteProductButton productId={product.id} productTitle={product.title} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/products?page=${p}${params.status ? `&status=${params.status}` : ''}`}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-all ${
                    p === page ? 'bg-brand-pink text-black font-bold' : 'text-brand-gray hover:text-white border border-white/10'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
