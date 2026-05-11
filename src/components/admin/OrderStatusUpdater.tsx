'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/utils'
import type { Order } from '@/types'

const statusOptions: Order['status'][] = [
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
]

interface OrderStatusUpdaterProps {
  orderId: string
  currentStatus: Order['status']
}

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Order['status']
    if (newStatus === currentStatus) return

    setIsUpdating(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) {
      toast.error('Failed to update order status')
    } else {
      toast.success(`Order status → ${newStatus}`)
      router.refresh()
    }

    setIsUpdating(false)
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isUpdating}
      className={cn(
        'bg-[#0d0d0d] border border-white/10 text-white text-xs px-2 py-1.5 rounded focus:border-brand-pink focus:outline-none transition-colors capitalize',
        isUpdating && 'opacity-50 cursor-wait'
      )}
      aria-label="Update order status"
    >
      {statusOptions.map((s) => (
        <option key={s} value={s} className="capitalize">
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  )
}
