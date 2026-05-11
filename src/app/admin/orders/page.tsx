import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { formatPriceSimple, formatDateTime, getOrderStatusColor } from '@/utils'
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater'
import type { Order, ShippingAddress } from '@/types'

export const metadata: Metadata = { title: 'Orders' }

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const limit = 20
  const from = (page - 1) * limit

  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }

  const { data, count } = await query
  const orders = (data ?? []) as Order[]
  const totalPages = Math.ceil((count ?? 0) / limit)

  const statusOptions = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Orders</h1>
          <p className="text-brand-gray text-sm mt-1">{count ?? 0} total orders</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {statusOptions.map((status) => (
          <a
            key={status}
            href={status === 'all' ? '/admin/orders' : `/admin/orders?status=${status}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
              (status === 'all' && !params.status) || params.status === status
                ? 'bg-brand-pink text-black border-brand-pink'
                : 'border-white/10 text-brand-gray hover:text-white'
            }`}
          >
            {status}
          </a>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-white/5 rounded-sm py-16 text-center">
          <p className="text-brand-gray">No orders found</p>
        </div>
      ) : (
        <>
          <div className="bg-[#0d0d0d] border border-white/5 rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Order', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Action'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-brand-gray uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const address = order.shipping_address as unknown as ShippingAddress
                    return (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-brand-pink font-mono text-xs">{order.order_number}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-white text-xs font-medium">{address?.full_name}</p>
                            <p className="text-brand-gray text-xs">{address?.phone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-brand-gray text-xs whitespace-nowrap">
                          {formatDateTime(order.created_at)}
                        </td>
                        <td className="px-4 py-4 text-brand-gray text-xs">
                          {(order.items ?? []).length} item(s)
                        </td>
                        <td className="px-4 py-4 text-white font-semibold whitespace-nowrap">
                          {formatPriceSimple(order.total)}
                        </td>
                        <td className="px-4 py-4 text-brand-gray capitalize text-xs">
                          {order.payment_method.replace('_', ' ')}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${getOrderStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/admin/orders?page=${p}${params.status ? `&status=${params.status}` : ''}`}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-all ${
                    p === page ? 'bg-brand-pink text-black font-bold' : 'text-brand-gray hover:text-white border border-white/10'
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
