'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, Minus, Save, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'
import { productSchema, type ProductInput } from '@/lib/validations'
import { generateSlug, cn } from '@/utils'
import type { Product } from '@/types'

interface Category { id: string; name: string; gender: string }

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']
type ImageInsert = Database['public']['Tables']['product_images']['Insert']
type VariantInsert = Database['public']['Tables']['product_variants']['Insert']

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!product
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images?.map((i) => i.url) || ['']
  )
  const [variants, setVariants] = useState<
    Array<{ size: string; color: string; color_hex: string; stock: number }>
  >(
    product?.variants?.map((v) => ({
      size: v.size || '',
      color: v.color || '',
      color_hex: v.color_hex || '',
      stock: v.stock,
    })) || []
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || '',
      slug: product?.slug || '',
      description: product?.description || '',
      short_description: product?.short_description || '',
      category_id: product?.category_id || '',
      gender: product?.gender || 'men',
      price: product?.price || 0,
      discount_price: product?.discount_price || null,
      sku: product?.sku || '',
      stock: product?.stock || 0,
      is_featured: product?.is_featured || false,
      is_new_arrival: product?.is_new_arrival ?? true,
      is_best_seller: product?.is_best_seller || false,
      status: product?.status || 'active',
      meta_title: product?.meta_title || '',
      meta_description: product?.meta_description || '',
      tags: product?.tags || [],
    },
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue('title', val)
    if (!isEditing) {
      setValue('slug', generateSlug(val))
    }
  }

  const onSubmit = async (data: ProductInput) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const payload: ProductInsert = {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        short_description: data.short_description || null,
        category_id: data.category_id || null,
        gender: data.gender,
        price: data.price,
        discount_price: data.discount_price || null,
        sku: data.sku || null,
        stock: data.stock,
        is_featured: data.is_featured,
        is_new_arrival: data.is_new_arrival,
        is_best_seller: data.is_best_seller,
        status: data.status,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        tags: data.tags || [],
        updated_at: new Date().toISOString(),
      }

      let productId = product?.id

      if (isEditing && productId) {
        const updatePayload: ProductUpdate = payload as ProductUpdate
        const { error } = await supabase.from('products').update(updatePayload).eq('id', productId)
        if (error) throw error
      } else {
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert(payload)
          .select('id')
          .single()
        if (error) throw error
        productId = newProduct.id
      }

      if (productId) {
        const validImages = imageUrls.filter((url) => url.trim())
        if (validImages.length > 0) {
          if (isEditing) {
            await supabase.from('product_images').delete().eq('product_id', productId)
          }
          const imageInserts: ImageInsert[] = validImages.map((url, index) => ({
            product_id: productId!,
            url,
            sort_order: index,
            is_primary: index === 0,
            alt_text: data.title,
          }))
          await supabase.from('product_images').insert(imageInserts)
        }

        if (variants.length > 0) {
          if (isEditing) {
            await supabase.from('product_variants').delete().eq('product_id', productId)
          }
          const variantInserts: VariantInsert[] = variants
            .filter((v) => v.size || v.color)
            .map((v) => ({
              product_id: productId!,
              size: v.size || null,
              color: v.color || null,
              color_hex: v.color_hex || null,
              stock: v.stock || 0,
              price_modifier: 0,
            }))
          await supabase.from('product_variants').insert(variantInserts)
        }
      }

      toast.success(isEditing ? 'Product updated!' : 'Product created!')
      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save product'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const addImageField = () => setImageUrls((prev) => [...prev, ''])
  const removeImageField = (i: number) => setImageUrls((prev) => prev.filter((_, idx) => idx !== i))
  const updateImageUrl = (i: number, val: string) =>
    setImageUrls((prev) => prev.map((url, idx) => (idx === i ? val : url)))

  const addVariant = () =>
    setVariants((prev) => [...prev, { size: '', color: '', color_hex: '', stock: 0 }])
  const removeVariant = (i: number) =>
    setVariants((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Basic Info */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6">
            <h2 className="font-semibold text-white mb-5">Basic Information</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  Title *
                </label>
                <input
                  {...register('title')}
                  onChange={handleTitleChange}
                  className={cn('form-input', errors.title && 'border-red-500')}
                  placeholder="Product title"
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  Slug *
                </label>
                <input
                  {...register('slug')}
                  className={cn('form-input font-mono text-sm', errors.slug && 'border-red-500')}
                  placeholder="product-slug"
                />
                {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  Short Description
                </label>
                <textarea
                  {...register('short_description')}
                  rows={2}
                  className="form-input resize-none"
                  placeholder="Brief product description (shown in cards)"
                />
              </div>

              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  Full Description
                </label>
                <textarea
                  {...register('description')}
                  rows={5}
                  className="form-input resize-none"
                  placeholder="Detailed product description"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6">
            <h2 className="font-semibold text-white mb-5">Pricing & Stock</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  Price (৳) *
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className={cn('form-input', errors.price && 'border-red-500')}
                  placeholder="0"
                />
                {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  Sale Price (৳)
                </label>
                <input
                  {...register('discount_price', {
                    setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                  })}
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="0"
                />
                {errors.discount_price && (
                  <p className="text-red-400 text-xs mt-1">{errors.discount_price.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  Stock *
                </label>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className={cn('form-input', errors.stock && 'border-red-500')}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  SKU
                </label>
                <input
                  {...register('sku')}
                  className="form-input font-mono text-sm"
                  placeholder="SKU-001"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">Product Images</h2>
              <button
                type="button"
                onClick={addImageField}
                className="text-xs text-brand-pink flex items-center gap-1 hover:text-brand-pink-light transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Image
              </button>
            </div>
            <p className="text-brand-gray text-xs mb-4">
              Enter image URLs. First image will be the primary display image.
            </p>
            <div className="flex flex-col gap-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-xs text-brand-gray w-4 flex-shrink-0">{i + 1}</span>
                  <input
                    value={url}
                    onChange={(e) => updateImageUrl(i, e.target.value)}
                    className="form-input flex-1 text-sm"
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(i)}
                      className="text-brand-gray hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Variants */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">Variants (Sizes & Colors)</h2>
              <button
                type="button"
                onClick={addVariant}
                className="text-xs text-brand-pink flex items-center gap-1 hover:text-brand-pink-light transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>
            {variants.length === 0 ? (
              <p className="text-brand-gray text-xs">No variants added. Product will use base stock.</p>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-4 gap-2 text-xs text-brand-gray uppercase tracking-wide">
                  <span>Size</span>
                  <span>Color</span>
                  <span>Hex</span>
                  <span>Stock</span>
                </div>
                {variants.map((variant, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 items-center">
                    <input
                      value={variant.size}
                      onChange={(e) =>
                        setVariants((prev) =>
                          prev.map((v, idx) => idx === i ? { ...v, size: e.target.value } : v)
                        )
                      }
                      className="form-input text-xs py-2"
                      placeholder="M"
                    />
                    <input
                      value={variant.color}
                      onChange={(e) =>
                        setVariants((prev) =>
                          prev.map((v, idx) => idx === i ? { ...v, color: e.target.value } : v)
                        )
                      }
                      className="form-input text-xs py-2"
                      placeholder="Black"
                    />
                    <input
                      value={variant.color_hex}
                      onChange={(e) =>
                        setVariants((prev) =>
                          prev.map((v, idx) => idx === i ? { ...v, color_hex: e.target.value } : v)
                        )
                      }
                      type="color"
                      className="form-input text-xs py-1 h-9 cursor-pointer"
                    />
                    <div className="flex gap-1">
                      <input
                        value={variant.stock}
                        onChange={(e) =>
                          setVariants((prev) =>
                            prev.map((v, idx) =>
                              idx === i ? { ...v, stock: parseInt(e.target.value) || 0 } : v
                            )
                          )
                        }
                        type="number"
                        min="0"
                        className="form-input text-xs py-2 flex-1"
                        placeholder="0"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="text-brand-gray hover:text-red-400 transition-colors px-1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6">
            <h2 className="font-semibold text-white mb-5">SEO</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  Meta Title <span className="text-brand-gray/50 normal-case">(max 70 chars)</span>
                </label>
                <input {...register('meta_title')} className="form-input" placeholder="SEO title" />
              </div>
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  Meta Description <span className="text-brand-gray/50 normal-case">(max 160 chars)</span>
                </label>
                <textarea
                  {...register('meta_description')}
                  rows={2}
                  className="form-input resize-none"
                  placeholder="SEO description"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Status & Category */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6">
            <h2 className="font-semibold text-white mb-5">Organisation</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  Status
                </label>
                <select {...register('status')} className="form-input">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  Gender *
                </label>
                <select
                  {...register('gender')}
                  className={cn('form-input', errors.gender && 'border-red-500')}
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  Category
                </label>
                <select {...register('category_id')} className="form-input">
                  <option value="">No category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.gender})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6">
            <h2 className="font-semibold text-white mb-5">Labels</h2>
            <div className="flex flex-col gap-3">
              {(
                [
                  { field: 'is_featured' as const, label: 'Featured Product' },
                  { field: 'is_new_arrival' as const, label: 'New Arrival' },
                  { field: 'is_best_seller' as const, label: 'Best Seller' },
                ] as const
              ).map(({ field, label }) => (
                <label key={field} className="flex items-center gap-3 cursor-pointer">
                  <input
                    {...register(field)}
                    type="checkbox"
                    className="w-4 h-4 accent-brand-pink"
                  />
                  <span className="text-sm text-brand-gray">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-sm font-bold disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full btn-outline flex items-center justify-center gap-2 py-3 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
