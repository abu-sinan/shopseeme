import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { formatPriceSimple, formatDate, getOrderStatusColor } from '@/utils'
import { Package } from 'lucide-react'
import type { Order, OrderItem, ShippingAddress } from '@/types'

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'View your order history at ShopSeeMe.',
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; order?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectedFrom=/orders')

  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const orders = (data ?? []) as unknown as Order[]

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="container-main py-10">
        {params.success === 'true' && params.order && (
          <div className="mb-8 bg-green-500/10 border border-green-500/20 rounded-sm p-5">
            <h2 className="text-green-400 font-semibold text-lg mb-1">🎉 Order Placed Successfully!</h2>
            <p className="text-brand-gray text-sm">
              Order <strong className="text-white">{params.order}</strong> has been received.
              We&apos;ll contact you shortly to confirm.
            </p>
          </div>
        )}

        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-10">My Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-brand-gray/30" />
            </div>
            <h2 className="text-xl font-display font-bold text-white mb-3">No orders yet</h2>
            <p className="text-brand-gray mb-8">Start shopping to see your orders here.</p>
            <Link href="/" className="btn-primary px-8 py-3 text-sm">Shop Now</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const address = order.shipping_address as unknown as ShippingAddress
              const items = (order.items ?? []) as OrderItem[]
              return (
                <div key={order.id} className="bg-[#0d0d0d] border border-white/5 rounded-sm overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-white/5">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-xs text-brand-gray mb-0.5">Order Number</p>
                        <p className="text-white font-semibold text-sm">{order.order_number}</p>
                      </div>
                      <div>
                        <p className="text-xs text-brand-gray mb-0.5">Date</p>
                        <p className="text-white text-sm">{formatDate(order.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-brand-gray mb-0.5">Total</p>
                        <p className="text-white font-semibold text-sm">{formatPriceSimple(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-brand-gray mb-0.5">Payment</p>
                        <p className="text-white text-sm capitalize">{order.payment_method.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${getOrderStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="px-5 py-4">
                    <div className="flex flex-col gap-2">
                      {items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-brand-gray">×{item.quantity}</span>
                            <span className="text-white line-clamp-1">{item.title}</span>
                            {item.size && (
                              <span className="text-xs border border-white/10 text-brand-gray px-1.5 py-0.5">
                                {item.size}
                              </span>
                            )}
                          </div>
                          <span className="text-white flex-shrink-0">{formatPriceSimple(item.subtotal)}</span>
                        </div>
                      ))}
                      {items.length > 3 && (
                        <p className="text-brand-gray text-xs">+{items.length - 3} more item(s)</p>
                      )}
                    </div>
                  </div>

                  {address && (
                    <div className="px-5 pb-4">
                      <p className="text-xs text-brand-gray">
                        Delivering to: {address.full_name}, {address.city}, {address.district}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
