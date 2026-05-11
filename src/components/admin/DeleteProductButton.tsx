'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface DeleteProductButtonProps {
  productId: string
  productTitle: string
}

export function DeleteProductButton({ productId, productTitle }: DeleteProductButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const supabase = createClient()

    try {
      // Delete images first
      await supabase.from('product_images').delete().eq('product_id', productId)
      // Delete variants
      await supabase.from('product_variants').delete().eq('product_id', productId)
      // Delete product
      const { error } = await supabase.from('products').delete().eq('id', productId)

      if (error) throw error

      toast.success(`"${productTitle}" deleted`)
      router.refresh()
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {isDeleting ? '...' : 'Yes'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-xs border border-white/10 text-brand-gray px-2 py-1 rounded hover:text-white transition-colors"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-1.5 text-brand-gray hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
      aria-label="Delete product"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
