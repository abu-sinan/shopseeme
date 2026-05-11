'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { formatPriceSimple, getDiscountPercent, cn } from '@/utils'
import type { ProductCard as ProductCardType } from '@/types'

interface ProductCardProps {
  product: ProductCardType
  className?: string
  priority?: boolean
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const hasDiscount = product.discount_price !== null && product.discount_price !== undefined
  const displayPrice = hasDiscount ? product.discount_price! : product.price
  const discountPercent = hasDiscount
    ? getDiscountPercent(product.price, product.discount_price!)
    : 0

  return (
    <article className={cn('product-card group', className)}>
      <Link
        href={`/products/${product.slug}`}
        aria-label={`${product.title} — ${formatPriceSimple(displayPrice)}`}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#0d0d0d]">
          {product.primary_image ? (
            <Image
              src={product.primary_image}
              alt={product.title}
              fill
              priority={priority}
              className="product-card-image group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-white/10" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.is_new_arrival && (
              <span className="badge-pink">New</span>
            )}
            {product.is_best_seller && !product.is_new_arrival && (
              <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5">
                Bestseller
              </span>
            )}
          </div>

          {hasDiscount && discountPercent > 0 && (
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5">
                -{discountPercent}%
              </span>
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="bg-black/90 backdrop-blur-sm py-3 text-center text-xs font-bold text-white uppercase tracking-widest">
              Quick View
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3">
          {product.category_name && (
            <p className="text-[10px] text-brand-gray uppercase tracking-wider mb-1">
              {product.category_name}
            </p>
          )}
          <h3 className="text-sm font-medium text-white leading-tight line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">
              {formatPriceSimple(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-brand-gray line-through">
                {formatPriceSimple(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

// Skeleton loader for product card
export function ProductCardSkeleton() {
  return (
    <div className="product-card">
      <div className="aspect-[3/4] skeleton" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
    </div>
  )
}
