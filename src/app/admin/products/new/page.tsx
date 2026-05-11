import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'

export const metadata: Metadata = { title: 'Add New Product' }

interface CategoryRow { id: string; name: string; gender: string }

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('id, name, gender')
    .eq('is_active', true)
    .order('name')

  const categories = (data ?? []) as CategoryRow[]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Add New Product</h1>
        <p className="text-brand-gray text-sm mt-1">Create a new product for your store</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
