import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ShoppingCart, Package, Users, DollarSign, AlertTriangle, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { formatPriceSimple, formatDate, getOrderStatusColor } from '@/utils'
import type { Order, ShippingAddress } from '@/types'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: totalProducts },
    { count: totalCustomers },
    { count: lowStockProducts },
    { data: revenueData },
    { data: recentOrdersData },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active').lt('stock', 5),
    supabase.from('orders').select('total').neq('status', 'cancelled'),
    supabase.from('orders').select('id, order_number, status, total, payment_method, shipping_address, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const totalRevenue = ((revenueData ?? []) as Array<{ total: number }>)
    .reduce((sum, o) => sum + o.total, 0)

  const recentOrders = (recentOrdersData ?? []) as Order[]

  const statCards = [
    { label: 'Total Revenue', value: formatPriceSimple(totalRevenue), icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', link: undefined },
    { label: 'Total Orders', value: String(totalOrders ?? 0), icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', link: '/admin/orders' },
    { label: 'Pending Orders', value: String(pendingOrders ?? 0), icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', link: '/admin/orders?status=pending' },
    { label: 'Active Products', value: String(totalProducts ?? 0), icon: Package, color: 'text-brand-pink', bg: 'bg-brand-pink/10', border: 'border-brand-pink/20', link: '/admin/products' },
    { label: 'Customers', value: String(totalCustomers ?? 0), icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', link: undefined },
    { label: 'Low Stock', value: String(lowStockProducts ?? 0), icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', link: undefined },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-brand-gray text-sm mt-1">Welcome back — here&apos;s what&apos;s happening</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg, border, link }) => {
          const card = (
            <div className={`bg-[#0d0d0d] border ${border} rounded-sm p-5 hover:bg-white/5 transition-colors`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-brand-gray text-xs uppercase tracking-wide">{label}</p>
                <div className={`${bg} p-2 rounded`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          )
          return link ? (
            <Link key={label} href={link} className="block">{card}</Link>
          ) : (
            <div key={label}>{card}</div>
          )
        })}
      </div>

      <div className="bg-[#0d0d0d] border border-white/5 rounded-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-semibold text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="flex items-center gap-1 text-xs text-brand-pink hover:text-brand-pink-light transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-brand-gray">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order', 'Customer', 'Date', 'Total', 'Status', 'Payment'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs text-brand-gray uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-brand-pink font-mono text-xs">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4 text-white">
                      {(order.shipping_address as unknown as ShippingAddress)?.full_name ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-brand-gray">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4 text-white font-medium">{formatPriceSimple(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-brand-gray capitalize">
                      {order.payment_method.replace('_', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
