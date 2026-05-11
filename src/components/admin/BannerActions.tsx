'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface BannerActionsProps {
  bannerId: string
  isActive: boolean
}

export function BannerActions({ bannerId, isActive }: BannerActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const toggleActive = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('banners')
      .update({ is_active: !isActive, updated_at: new Date().toISOString() })
      .eq('id', bannerId)

    if (error) {
      toast.error('Failed to update banner')
    } else {
      toast.success(isActive ? 'Banner deactivated' : 'Banner activated')
      router.refresh()
    }
    setIsLoading(false)
  }

  const deleteBanner = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('banners').delete().eq('id', bannerId)

    if (error) {
      toast.error('Failed to delete banner')
    } else {
      toast.success('Banner deleted')
      router.refresh()
    }
    setIsLoading(false)
    setShowDeleteConfirm(false)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleActive}
        disabled={isLoading}
        className="p-1.5 border border-white/10 text-brand-gray hover:text-white hover:border-white/30 rounded transition-all disabled:opacity-50"
        title={isActive ? 'Deactivate' : 'Activate'}
      >
        {isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>

      {showDeleteConfirm ? (
        <div className="flex items-center gap-1">
          <button
            onClick={deleteBanner}
            disabled={isLoading}
            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="text-xs border border-white/10 text-brand-gray px-2 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-1.5 border border-white/10 text-brand-gray hover:text-red-400 hover:border-red-400/30 rounded transition-all"
          title="Delete banner"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
