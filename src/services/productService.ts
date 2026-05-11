import { createClient } from '@/lib/supabase/server'
import type { Product, ProductCard, ProductFilters, PaginatedResponse } from '@/types'

// ---- Internal raw DB row types ----
interface RawProductImage {
  url: string
  is_primary: boolean
  sort_order: number
}

interface RawCategory {
  name: string
}

interface RawProductRow {
  id: string
  title: string
  slug: string
  price: number
  discount_price: number | null
  gender: string
  is_featured: boolean
  is_new_arrival: boolean
  is_best_seller: boolean
  categories: RawCategory | null
  product_images: RawProductImage[] | null
}

function mapRawToProductCard(p: RawProductRow): ProductCard {
  const sortedImages = [...(p.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  )
  const primaryImage =
    sortedImages.find((img) => img.is_primary)?.url ??
    sortedImages[0]?.url ??
    null

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    price: p.price,
    discount_price: p.discount_price,
    gender: p.gender as ProductCard['gender'],
    is_featured: p.is_featured,
    is_new_arrival: p.is_new_arrival,
    is_best_seller: p.is_best_seller,
    primary_image: primaryImage,
    category_name: p.categories?.name ?? null,
  }
}

/**
 * Fetch products with filters and pagination
 */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<ProductCard>> {
  const supabase = await createClient()
  const {
    gender,
    category_id,
    min_price,
    max_price,
    is_featured,
    is_new_arrival,
    is_best_seller,
    sort = 'newest',
    page = 1,
    limit = 12,
    search,
  } = filters

  let query = supabase
    .from('products')
    .select(
      `id, title, slug, price, discount_price, gender,
       is_featured, is_new_arrival, is_best_seller,
       categories(name),
       product_images(url, is_primary, sort_order)`,
      { count: 'exact' }
    )
    .eq('status', 'active')

  if (gender) query = query.eq('gender', gender)
  if (category_id) query = query.eq('category_id', category_id)
  if (min_price !== undefined) query = query.gte('price', min_price)
  if (max_price !== undefined) query = query.lte('price', max_price)
  if (is_featured !== undefined) query = query.eq('is_featured', is_featured)
  if (is_new_arrival !== undefined) query = query.eq('is_new_arrival', is_new_arrival)
  if (is_best_seller !== undefined) query = query.eq('is_best_seller', is_best_seller)
  if (search) query = query.ilike('title', `%${search}%`)

  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'popular':
      query = query.order('is_best_seller', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { data: [], total: 0, page, limit, hasMore: false }
  }

  const products = (data as unknown as RawProductRow[]).map(mapRawToProductCard)
  const total = count ?? 0

  return {
    data: products,
    total,
    page,
    limit,
    hasMore: from + products.length < total,
  }
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`*, categories(*), product_images(*), product_variants(*)`)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !data) return null
  return data as unknown as Product
}

/**
 * Fetch featured products for homepage
 */
export async function getFeaturedProducts(limit = 8): Promise<ProductCard[]> {
  const result = await getProducts({ is_featured: true, limit, sort: 'newest' })
  return result.data
}

/**
 * Fetch new arrivals
 */
export async function getNewArrivals(limit = 8): Promise<ProductCard[]> {
  const result = await getProducts({ is_new_arrival: true, limit, sort: 'newest' })
  return result.data
}

/**
 * Fetch best sellers
 */
export async function getBestSellers(limit = 8): Promise<ProductCard[]> {
  const result = await getProducts({ is_best_seller: true, limit, sort: 'popular' })
  return result.data
}

/**
 * Get related products (same gender/category, different product)
 */
export async function getRelatedProducts(
  productId: string,
  gender: string,
  categoryId?: string,
  limit = 4
): Promise<ProductCard[]> {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(
      `id, title, slug, price, discount_price, gender,
       is_featured, is_new_arrival, is_best_seller,
       categories(name),
       product_images(url, is_primary, sort_order)`
    )
    .eq('status', 'active')
    .eq('gender', gender)
    .neq('id', productId)
    .limit(limit)

  if (categoryId) query = query.eq('category_id', categoryId)

  const { data, error } = await query

  if (error || !data) return []
  return (data as unknown as RawProductRow[]).map(mapRawToProductCard)
}

/**
 * Get all product slugs for static generation
 */
export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('slug')
    .eq('status', 'active')

  return (data ?? []).map((p: { slug: string }) => p.slug)
}
