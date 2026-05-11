'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, Share2, ChevronRight, Minus, Plus, Check, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cartStore'
import { formatPriceSimple, getDiscountPercent, getGenderLabel, cn } from '@/utils'
import type { Product, ProductVariant } from '@/types'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCartStore()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const images = product.images?.sort((a, b) => a.sort_order - b.sort_order) || []
  const primaryImage = images[0]?.url

  const hasDiscount = product.discount_price !== null && product.discount_price !== undefined
  const displayPrice = hasDiscount ? product.discount_price! : product.price
  const discountPercent = hasDiscount ? getDiscountPercent(product.price, product.discount_price!) : 0

  // Derive unique sizes and colors from variants
  const uniqueSizes = [...new Set(product.variants?.map((v) => v.size).filter(Boolean) as string[])]
  const uniqueColors = product.variants
    ? [...new Map(product.variants.filter((v) => v.color).map((v) => [v.color, v])).values()]
    : []

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    // Find matching variant
    const variant = product.variants?.find(
      (v) => v.size === size && (selectedColor ? v.color === selectedColor : true)
    )
    setSelectedVariant(variant || null)
  }

  const handleColorSelect = (color: string, _colorHex: string | null) => {
    setSelectedColor(color)
    const variant = product.variants?.find(
      (v) => v.color === color && (selectedSize ? v.size === selectedSize : true)
    )
    setSelectedVariant(variant || null)
  }

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock
  const isInStock = currentStock > 0

  const handleAddToCart = () => {
    if (uniqueSizes.length > 0 && !selectedSize) {
      toast.error('Please select a size')
      return
    }
    if (uniqueColors.length > 0 && !selectedColor) {
      toast.error('Please select a colour')
      return
    }
    if (!isInStock) {
      toast.error('This item is out of stock')
      return
    }

    const variantPrice = selectedVariant
      ? displayPrice + (selectedVariant.price_modifier || 0)
      : displayPrice

    addItem({
      product_id: product.id,
      variant_id: selectedVariant?.id || null,
      title: product.title,
      slug: product.slug,
      price: variantPrice,
      quantity,
      size: selectedSize,
      color: selectedColor,
      color_hex: selectedVariant?.color_hex || null,
      image_url: primaryImage || null,
      max_stock: currentStock,
    })

    toast.success(`${product.title} added to cart!`, {
      description: selectedSize ? `Size: ${selectedSize}` : undefined,
    })
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.title,
        url: window.location.href,
      })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <div className="container-main py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-brand-gray mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/${product.gender}`} className="hover:text-white transition-colors capitalize">
          {getGenderLabel(product.gender)}
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="hover:text-white transition-colors">{product.category.name}</span>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-white truncate max-w-40">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar md:max-h-[600px] flex-shrink-0">
              {images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    'relative flex-shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden rounded-sm border-2 transition-all',
                    index === selectedImageIndex
                      ? 'border-brand-pink'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt_text || `${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="relative flex-1 aspect-[3/4] overflow-hidden rounded-sm bg-[#0d0d0d]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {images[selectedImageIndex] ? (
                  <Image
                    src={images[selectedImageIndex].url}
                    alt={images[selectedImageIndex].alt_text || product.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-white/10" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.is_new_arrival && (
                <span className="badge-pink">New</span>
              )}
              {hasDiscount && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1">
                  -{discountPercent}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          {/* Title + Actions */}
          <div className="flex items-start justify-between gap-4">
            <div>
              {product.category && (
                <p className="text-xs text-brand-gray uppercase tracking-widest mb-2">
                  {product.category.name}
                </p>
              )}
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {product.title}
              </h1>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn(
                  'p-2.5 border rounded-sm transition-all',
                  isWishlisted
                    ? 'border-red-500 text-red-500 bg-red-500/10'
                    : 'border-white/10 text-brand-gray hover:text-white hover:border-white/30'
                )}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={cn('w-4 h-4', isWishlisted && 'fill-red-500')} />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 border border-white/10 text-brand-gray hover:text-white hover:border-white/30 rounded-sm transition-all"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-white">
              {formatPriceSimple(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-brand-gray line-through">
                {formatPriceSimple(product.price)}
              </span>
            )}
            {hasDiscount && (
              <span className="text-brand-pink text-sm font-semibold">
                Save {formatPriceSimple(product.price - product.discount_price!)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', isInStock ? 'bg-green-400' : 'bg-red-400')} />
            <span className={cn('text-sm font-medium', isInStock ? 'text-green-400' : 'text-red-400')}>
              {isInStock
                ? currentStock <= 5
                  ? `Only ${currentStock} left in stock`
                  : 'In Stock'
                : 'Out of Stock'}
            </span>
          </div>

          <div className="divider" />

          {/* Color Selector */}
          {uniqueColors.length > 0 && (
            <div>
              <p className="text-sm font-medium text-white mb-3">
                Colour: <span className="text-brand-gray">{selectedColor || 'Select'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {uniqueColors.map((variant) => (
                  <button
                    key={variant.color}
                    onClick={() => handleColorSelect(variant.color!, variant.color_hex)}
                    title={variant.color!}
                    className={cn(
                      'relative w-9 h-9 rounded-full border-2 transition-all',
                      selectedColor === variant.color
                        ? 'border-brand-pink scale-110'
                        : 'border-white/20 hover:border-white/50'
                    )}
                    style={{
                      backgroundColor: variant.color_hex || '#888',
                    }}
                    aria-label={`Select ${variant.color}`}
                    aria-pressed={selectedColor === variant.color}
                  >
                    {selectedColor === variant.color && (
                      <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {uniqueSizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-white">
                  Size: <span className="text-brand-gray">{selectedSize || 'Select'}</span>
                </p>
                <button className="text-xs text-brand-pink underline hover:text-brand-pink-light transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {uniqueSizes.map((size) => {
                  const variantForSize = product.variants?.find(
                    (v) => v.size === size && (selectedColor ? v.color === selectedColor : true)
                  )
                  const sizeStock = variantForSize ? variantForSize.stock : product.stock
                  const isOutOfStock = sizeStock === 0

                  return (
                    <button
                      key={size}
                      onClick={() => !isOutOfStock && handleSizeSelect(size)}
                      disabled={isOutOfStock}
                      className={cn(
                        'min-w-[3rem] h-10 px-3 border text-sm font-medium transition-all rounded-sm',
                        selectedSize === size
                          ? 'bg-brand-pink text-black border-brand-pink'
                          : isOutOfStock
                          ? 'border-white/10 text-brand-gray/30 line-through cursor-not-allowed'
                          : 'border-white/20 text-brand-gray hover:border-white hover:text-white'
                      )}
                      aria-label={`Size ${size}${isOutOfStock ? ' (out of stock)' : ''}`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <p className="text-sm font-medium text-white mb-3">Quantity</p>
            <div className="flex items-center gap-0 w-fit border border-white/20">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-brand-gray hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 h-10 flex items-center justify-center text-white font-semibold text-sm border-x border-white/20">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                disabled={quantity >= currentStock}
                className="w-10 h-10 flex items-center justify-center text-brand-gray hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-wider transition-all',
                isInStock
                  ? 'btn-primary'
                  : 'bg-white/10 text-brand-gray cursor-not-allowed'
              )}
            >
              <ShoppingBag className="w-4 h-4" />
              {isInStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <Link
              href="/checkout"
              onClick={handleAddToCart}
              className="flex-1 btn-outline flex items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-wider"
            >
              Buy Now
            </Link>
          </div>

          {/* Delivery Info */}
          <div className="bg-[#0d0d0d] rounded-sm p-4 flex flex-col gap-3">
            {[
              { icon: Truck, text: 'Free delivery on orders over ৳2,000' },
              { icon: RotateCcw, text: '7-day easy returns & exchanges' },
              { icon: ShieldCheck, text: 'Secure payment & data protection' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-brand-pink flex-shrink-0" />
                <span className="text-brand-gray text-xs">{text}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          {(product.description || product.short_description) && (
            <div className="border-t border-white/10 pt-6">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                Product Details
              </h2>
              <div className="text-brand-gray text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                <p>{product.description || product.short_description}</p>
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs border border-white/10 text-brand-gray px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
