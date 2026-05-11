import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Product } from '@/types'

export const metadata: Metadata = { title: 'Edit Product' }

interface PageProps {
  params: Promise<{ id: string }>
}

interface CategoryRow { id: string; name: string; gender: string }

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: productData } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('id', id)
    .single()

  if (!productData) notFound()

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name, gender')
    .eq('is_active', true)
    .order('name')

  const product = productData as unknown as Product
  const categories = (categoriesData ?? []) as CategoryRow[]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Edit Product</h1>
        <p className="text-brand-gray text-sm mt-1">{product.title}</p>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  )
}
