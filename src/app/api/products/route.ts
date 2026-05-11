import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ProductFilters } from '@/types'

interface RawProductImage {
  url: string
  is_primary: boolean
  sort_order: number
}

interface RawCategory {
  name: string
}

interface RawApiProductRow {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const supabase = await createClient()

    const filters: ProductFilters = {
      gender: (searchParams.get('gender') as ProductFilters['gender']) || undefined,
      category_id: searchParams.get('category_id') || undefined,
      min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
      max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
      is_featured: searchParams.get('is_featured') === 'true' ? true : undefined,
      is_new_arrival: searchParams.get('is_new_arrival') === 'true' ? true : undefined,
      is_best_seller: searchParams.get('is_best_seller') === 'true' ? true : undefined,
      sort: (searchParams.get('sort') as ProductFilters['sort']) || 'newest',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Math.min(Number(searchParams.get('limit')), 48) : 12,
      search: searchParams.get('search') || undefined,
    }

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

    if (filters.gender) query = query.eq('gender', filters.gender)
    if (filters.category_id) query = query.eq('category_id', filters.category_id)
    if (filters.min_price !== undefined) query = query.gte('price', filters.min_price)
    if (filters.max_price !== undefined) query = query.lte('price', filters.max_price)
    if (filters.is_featured) query = query.eq('is_featured', true)
    if (filters.is_new_arrival) query = query.eq('is_new_arrival', true)
    if (filters.is_best_seller) query = query.eq('is_best_seller', true)
    if (filters.search) query = query.ilike('title', `%${filters.search}%`)

    switch (filters.sort) {
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

    const page = filters.page ?? 1
    const limit = filters.limit ?? 12
    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query

    if (error) {
      // Return empty data gracefully instead of crashing — DB may not be configured yet
      console.warn('Products query error (DB may not be configured):', error.message)
      return NextResponse.json(
        { data: [], total: 0, page, limit, hasMore: false },
        {
          status: 200,
          headers: { 'Cache-Control': 'no-store' },
        }
      )
    }

    const products = (data as unknown as RawApiProductRow[]).map((p) => {
      const sorted = [...(p.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        price: p.price,
        discount_price: p.discount_price,
        gender: p.gender,
        is_featured: p.is_featured,
        is_new_arrival: p.is_new_arrival,
        is_best_seller: p.is_best_seller,
        primary_image: sorted.find((img) => img.is_primary)?.url ?? sorted[0]?.url ?? null,
        category_name: p.categories?.name ?? null,
      }
    })

    const total = count ?? 0

    return NextResponse.json(
      { data: products, total, page, limit, hasMore: from + products.length < total },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
    )
  } catch (err) {
    console.warn('Products API error:', err)
    // Return empty data instead of 500 so the page renders
    return NextResponse.json(
      { data: [], total: 0, page: 1, limit: 12, hasMore: false },
      { status: 200 }
    )
  }
}
