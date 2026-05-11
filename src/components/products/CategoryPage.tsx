'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { ProductCard, ProductCardSkeleton } from './ProductCard'
import { cn } from '@/utils'
import type { ProductCard as ProductCardType, Gender } from '@/types'

interface CategoryPageProps {
  gender: Gender
  title: string
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

const filterTabs = [
  { value: undefined as string | undefined, label: 'All' },
  { value: 'new', label: 'New Arrivals' },
  { value: 'best', label: 'Best Sellers' },
  { value: 'featured', label: 'Featured' },
]

const genderImages: Record<string, string> = {
  men: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1400&h=400&fit=crop&q=80',
  women: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&h=400&fit=crop&q=80',
  kids: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1400&h=400&fit=crop&q=80',
}

function CategoryContent({ gender, title }: CategoryPageProps) {
  const searchParams = useSearchParams()
  const initialFilter = searchParams.get('filter') ?? undefined

  const [products, setProducts] = useState<ProductCardType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [activeFilter, setActiveFilter] = useState<string | undefined>(initialFilter)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const fetchProducts = useCallback(
    async (reset = false) => {
      setIsLoading(true)
      const currentPage = reset ? 1 : page

      try {
        const params = new URLSearchParams({
          gender,
          sort,
          page: currentPage.toString(),
          limit: '12',
        })

        if (activeFilter === 'new') params.set('is_new_arrival', 'true')
        if (activeFilter === 'best') params.set('is_best_seller', 'true')
        if (activeFilter === 'featured') params.set('is_featured', 'true')

        const res = await fetch(`/api/products?${params.toString()}`)
        const data = res.ok ? await res.json() : { data: [], total: 0, hasMore: false }

        if (reset || currentPage === 1) {
          setProducts(data.data || [])
        } else {
          setProducts((prev) => [...prev, ...(data.data || [])])
        }

        setTotal(data.total || 0)
        setHasMore(data.hasMore || false)
        if (reset) setPage(1)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gender, sort, activeFilter]
  )

  useEffect(() => {
    fetchProducts(true)
  }, [fetchProducts])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProducts(false)
  }

  return (
    <div className="min-h-screen bg-black pt-16 md:pt-20">
      {/* Category Hero Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${genderImages[gender] || genderImages.men})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <p className="section-subheading mb-2">ShopSeeMe Collection</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white">{title}</h1>
          <p className="text-brand-gray mt-2 text-sm">
            {total > 0 ? `${total} products` : 'Explore our collection'}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border-b border-white/10 sticky top-16 md:top-20 bg-black/95 backdrop-blur-md z-30">
        <div className="container-main py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {filterTabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveFilter(tab.value)}
                  className={cn(
                    'flex-shrink-0 text-xs font-medium uppercase tracking-wide px-4 py-2 rounded-full transition-all',
                    activeFilter === tab.value
                      ? 'bg-brand-pink text-black'
                      : 'text-brand-gray hover:text-white border border-white/10'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-1.5 text-xs text-brand-gray hover:text-white border border-white/10 px-3 py-2 rounded transition-colors"
              >
                <span className="hidden sm:inline">Sort:</span>
                <span className="text-white">{sortOptions.find((s) => s.value === sort)?.label}</span>
                <ChevronDown className={cn('w-3 h-3 transition-transform', isSortOpen && 'rotate-180')} />
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-[#0d0d0d] border border-white/10 rounded shadow-xl z-20 min-w-44">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSort(option.value); setIsSortOpen(false) }}
                        className={cn(
                          'w-full text-left text-xs px-4 py-2.5 hover:bg-white/5 transition-colors',
                          sort === option.value ? 'text-brand-pink' : 'text-brand-gray hover:text-white'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container-main py-10">
        {isLoading && products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-4xl mb-4">🛍️</p>
            <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
            <p className="text-brand-gray text-sm">Try adjusting your filters or check back soon.</p>
            <button onClick={() => setActiveFilter(undefined)} className="mt-6 btn-outline text-sm px-6 py-2.5">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                >
                  <ProductCard product={product} priority={index < 4} />
                </motion.div>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="btn-outline px-10 py-3 text-sm disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Load More Products'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export function CategoryPage(props: CategoryPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CategoryContent {...props} />
    </Suspense>
  )
}
