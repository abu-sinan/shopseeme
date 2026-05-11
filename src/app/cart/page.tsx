'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPriceSimple, calculateShipping } from '@/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const subtotal = getTotalPrice()
  const shipping = calculateShipping(subtotal)
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="container-main py-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
            Shopping Cart
            {items.length > 0 && (
              <span className="text-brand-pink ml-3 text-2xl">({items.length})</span>
            )}
          </h1>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-brand-gray hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-brand-gray/30" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-3">Your cart is empty</h2>
            <p className="text-brand-gray mb-8 max-w-sm">
              Looks like you haven&apos;t added anything yet. Explore our collections!
            </p>
            <div className="flex gap-4">
              <Link href="/women" className="btn-primary px-8 py-3 text-sm">
                Shop Women
              </Link>
              <Link href="/men" className="btn-outline px-8 py-3 text-sm">
                Shop Men
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 p-4 bg-[#0d0d0d] border border-white/5 rounded-sm"
                >
                  {/* Image */}
                  <div className="relative w-24 h-32 flex-shrink-0 overflow-hidden rounded-sm bg-white/5">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-brand-gray/20" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-white font-medium text-sm hover:text-brand-pink transition-colors line-clamp-2"
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1.5">
                          {item.size && (
                            <span className="text-xs border border-white/10 text-brand-gray px-2 py-0.5">
                              {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="flex items-center gap-1 text-xs text-brand-gray">
                              {item.color_hex && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-white/20"
                                  style={{ backgroundColor: item.color_hex }}
                                />
                              )}
                              {item.color}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-brand-gray hover:text-red-400 transition-colors flex-shrink-0 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-brand-gray hover:text-white transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-sm text-white font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.max_stock}
                          className="w-8 h-8 flex items-center justify-center text-brand-gray hover:text-white transition-colors disabled:opacity-30"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-white font-bold text-sm">
                        {formatPriceSimple(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6 sticky top-24">
                <h2 className="font-semibold text-white text-lg mb-6">Order Summary</h2>

                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray">Subtotal ({items.length} items)</span>
                    <span className="text-white">{formatPriceSimple(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400 font-medium' : 'text-white'}>
                      {shipping === 0 ? 'FREE' : formatPriceSimple(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-brand-gray/60 bg-white/5 px-3 py-2 rounded">
                      Add <strong>{formatPriceSimple(2000 - subtotal)}</strong> more for free shipping
                    </p>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-white text-lg">{formatPriceSimple(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-sm font-bold"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="mt-4 flex flex-col gap-1.5">
                  <p className="text-xs text-brand-gray text-center">
                    ✓ Cash on Delivery available
                  </p>
                  <p className="text-xs text-brand-gray text-center">
                    ✓ Secure & encrypted checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
