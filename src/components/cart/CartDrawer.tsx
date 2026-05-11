'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPriceSimple, calculateShipping } from '@/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const drawerRef = useRef<HTMLDivElement>(null)

  const subtotal = getTotalPrice()
  const shipping = calculateShipping(subtotal)
  const total = subtotal + shipping

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#050505] border-l border-white/10 flex flex-col"
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-pink" />
                <h2 className="font-semibold text-white">Your Cart</h2>
                {items.length > 0 && (
                  <span className="bg-brand-pink text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 text-brand-gray hover:text-white transition-colors rounded"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-brand-gray/50" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Your cart is empty</p>
                    <p className="text-brand-gray text-sm">
                      Start shopping to add items to your cart
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="btn-primary text-sm px-6 py-2.5 mt-2"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-4" role="list">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-4 pb-4 border-b border-white/5 last:border-0"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-24 bg-white/5 flex-shrink-0 overflow-hidden rounded-sm">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-brand-gray/30" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-white hover:text-brand-pink transition-colors line-clamp-2"
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          {item.size && (
                            <span className="text-xs text-brand-gray border border-white/10 px-1.5 py-0.5">
                              {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-xs text-brand-gray flex items-center gap-1">
                              {item.color_hex && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block"
                                  style={{ backgroundColor: item.color_hex }}
                                />
                              )}
                              {item.color}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 border border-white/10">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 text-brand-gray hover:text-white transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm text-white font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.max_stock}
                              className="p-1.5 text-brand-gray hover:text-white transition-colors disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price + Remove */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-white">
                              {formatPriceSimple(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-brand-gray hover:text-red-400 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer with Totals */}
            {items.length > 0 && (
              <div className="border-t border-white/10 px-6 pt-4 pb-6 space-y-3">
                <div className="flex justify-between text-sm text-brand-gray">
                  <span>Subtotal</span>
                  <span>{formatPriceSimple(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-brand-gray">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : ''}>
                    {shipping === 0 ? 'FREE' : formatPriceSimple(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-brand-gray/60">
                    Add {formatPriceSimple(2000 - subtotal)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span>{formatPriceSimple(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full btn-primary mt-2 text-sm py-3.5"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-sm text-brand-gray hover:text-white transition-colors py-2"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
