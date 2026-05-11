import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, ImageIcon } from 'lucide-react'
import { BannerActions } from '@/components/admin/BannerActions'
import type { Banner } from '@/types'

export const metadata: Metadata = { title: 'Banners' }

export default async function AdminBannersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order', { ascending: true })

  const banners = (data ?? []) as Banner[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Banners</h1>
          <p className="text-brand-gray text-sm mt-1">Manage homepage and promotional banners</p>
        </div>
        <Link href="/admin/banners/new" className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5">
          <Plus className="w-4 h-4" />
          Add Banner
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-white/5 rounded-sm py-16 text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-brand-gray/20" />
          <p className="text-brand-gray">No banners yet</p>
          <Link href="/admin/banners/new" className="btn-primary mt-4 inline-flex text-sm px-6 py-2.5">
            Create First Banner
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-[#0d0d0d] border border-white/5 rounded-sm overflow-hidden">
              <div className="relative aspect-[16/7] bg-white/5">
                {banner.image_url ? (
                  <Image
                    src={banner.image_url}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-brand-gray/20" />
                  </div>
                )}
                <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${
                  banner.is_active
                    ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                    : 'bg-gray-400/20 text-gray-400 border border-gray-400/30'
                }`}>
                  {banner.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="text-brand-gray text-xs mb-2 line-clamp-1">{banner.subtitle}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-xs text-brand-gray">
                    <span>Order: {banner.sort_order}</span>
                    {banner.cta_url && <span>→ {banner.cta_text ?? 'CTA'}</span>}
                  </div>
                  <BannerActions bannerId={banner.id} isActive={banner.is_active} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
