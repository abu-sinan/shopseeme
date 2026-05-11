'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ShoppingBag, ChevronDown, Lock } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { checkoutSchema, type CheckoutInput } from '@/lib/validations'
import { formatPriceSimple, calculateShipping, cn } from '@/utils'
import { DISTRICTS } from '@/types'
import { createClient } from '@/lib/supabase/client'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = getTotalPrice()
  const shipping = calculateShipping(subtotal)
  const total = subtotal + shipping

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment_method: 'cod',
    },
  })

  const paymentMethod = watch('payment_method')

  const onSubmit = async (data: CheckoutInput) => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          formData: data,
          userId: user?.id || null,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to place order')
      }

      clearCart()
      router.push(`/orders?success=true&order=${result.order?.order_number}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="container-main py-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-10">
          Checkout
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Delivery Information */}
              <section className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6">
                <h2 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-pink text-black text-xs font-bold flex items-center justify-center">1</span>
                  Delivery Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('full_name')}
                      className={cn('form-input', errors.full_name && 'border-red-500')}
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                    {errors.full_name && (
                      <p className="text-red-400 text-xs mt-1">{errors.full_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                      Phone Number *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className={cn('form-input', errors.phone && 'border-red-500')}
                      placeholder="01XXXXXXXXX"
                      autoComplete="tel"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                      Email (optional)
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className={cn('form-input', errors.email && 'border-red-500')}
                      placeholder="email@example.com"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      {...register('address_line1')}
                      className={cn('form-input', errors.address_line1 && 'border-red-500')}
                      placeholder="House, Road, Area"
                      autoComplete="address-line1"
                    />
                    {errors.address_line1 && (
                      <p className="text-red-400 text-xs mt-1">{errors.address_line1.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                      Address Line 2 (optional)
                    </label>
                    <input
                      {...register('address_line2')}
                      className="form-input"
                      placeholder="Apartment, Suite, etc."
                      autoComplete="address-line2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                      City / Thana *
                    </label>
                    <input
                      {...register('city')}
                      className={cn('form-input', errors.city && 'border-red-500')}
                      placeholder="Dhaka"
                      autoComplete="address-level2"
                    />
                    {errors.city && (
                      <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                      District *
                    </label>
                    <div className="relative">
                      <select
                        {...register('district')}
                        className={cn('form-input appearance-none pr-8', errors.district && 'border-red-500')}
                      >
                        <option value="">Select district</option>
                        {DISTRICTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray pointer-events-none" />
                    </div>
                    {errors.district && (
                      <p className="text-red-400 text-xs mt-1">{errors.district.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                      Postal Code (optional)
                    </label>
                    <input
                      {...register('postal_code')}
                      className="form-input"
                      placeholder="1000"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                      Order Notes (optional)
                    </label>
                    <textarea
                      {...register('notes')}
                      rows={2}
                      className="form-input resize-none"
                      placeholder="Special instructions for your order..."
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6">
                <h2 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-pink text-black text-xs font-bold flex items-center justify-center">2</span>
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {/* Cash on Delivery */}
                  <label
                    className={cn(
                      'flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-all',
                      paymentMethod === 'cod'
                        ? 'border-brand-pink bg-brand-pink/5'
                        : 'border-white/10 hover:border-white/30'
                    )}
                  >
                    <input
                      {...register('payment_method')}
                      type="radio"
                      value="cod"
                      className="sr-only"
                      
                    />
                    <div className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                      paymentMethod === 'cod' ? 'border-brand-pink' : 'border-white/30'
                    )}>
                      {paymentMethod === 'cod' && (
                        <div className="w-2 h-2 rounded-full bg-brand-pink" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Cash on Delivery</p>
                      <p className="text-brand-gray text-xs">Pay when you receive</p>
                    </div>
                  </label>

                  {/* bKash */}
                  <label
                    className={cn(
                      'flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-all',
                      paymentMethod === 'bkash'
                        ? 'border-[#E21F63] bg-[#E21F63]/5'
                        : 'border-white/10 hover:border-white/30'
                    )}
                  >
                    <input
                      {...register('payment_method')}
                      type="radio"
                      value="bkash"
                      className="sr-only"
                      
                    />
                    <div className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                      paymentMethod === 'bkash' ? 'border-[#E21F63]' : 'border-white/30'
                    )}>
                      {paymentMethod === 'bkash' && (
                        <div className="w-2 h-2 rounded-full bg-[#E21F63]" />
                      )}
                    </div>
                    <div>
                      <p className="text-[#E21F63] font-bold text-sm">bKash</p>
                      <p className="text-brand-gray text-xs">Mobile banking</p>
                    </div>
                  </label>
                </div>

                {/* bKash Instructions */}
                {paymentMethod === 'bkash' && (
                  <div className="bg-[#E21F63]/5 border border-[#E21F63]/20 rounded-sm p-4 mb-4">
                    <h3 className="text-[#E21F63] font-semibold text-sm mb-2">bKash Payment Instructions</h3>
                    <ol className="text-brand-gray text-xs space-y-1 list-decimal list-inside">
                      <li>Send money to our bKash merchant: <strong className="text-white">01XXXXXXXXX</strong></li>
                      <li>Use your phone number as reference</li>
                      <li>Enter the Transaction ID below</li>
                    </ol>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div>
                        <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                          bKash Number *
                        </label>
                        <input
                          {...register('bkash_number')}
                          className={cn('form-input', errors.bkash_number && 'border-red-500')}
                          placeholder="01XXXXXXXXX"
                        />
                        {errors.bkash_number && (
                          <p className="text-red-400 text-xs mt-1">{errors.bkash_number.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                          Transaction ID *
                        </label>
                        <input
                          {...register('bkash_transaction_id')}
                          className={cn('form-input', errors.bkash_transaction_id && 'border-red-500')}
                          placeholder="TrxID..."
                        />
                        {errors.bkash_transaction_id && (
                          <p className="text-red-400 text-xs mt-1">{errors.bkash_transaction_id.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6 sticky top-24">
                <h2 className="font-semibold text-white text-lg mb-6">Order Summary</h2>

                {/* Items */}
                <div className="flex flex-col gap-3 mb-6 max-h-64 overflow-y-auto no-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-14 flex-shrink-0 bg-white/5 rounded overflow-hidden">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="48px" />
                        ) : (
                          <ShoppingBag className="w-4 h-4 text-brand-gray/30 absolute inset-0 m-auto" />
                        )}
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-pink text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium line-clamp-1">{item.title}</p>
                        {item.size && <p className="text-brand-gray text-xs">Size: {item.size}</p>}
                      </div>
                      <span className="text-white text-xs font-semibold flex-shrink-0">
                        {formatPriceSimple(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 flex flex-col gap-2.5 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray">Subtotal</span>
                    <span className="text-white">{formatPriceSimple(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                      {shipping === 0 ? 'FREE' : formatPriceSimple(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10">
                    <span className="text-white">Total</span>
                    <span className="text-white">{formatPriceSimple(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Lock className="w-4 h-4" />
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>

                <p className="text-xs text-brand-gray text-center mt-3">
                  🔒 Your information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
