'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Save, ArrowLeft } from 'lucide-react'
import { bannerSchema, type BannerInput } from '@/lib/validations'
import { cn } from '@/utils'

export default function NewBannerPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      is_active: true,
      sort_order: 0,
    },
  })

  const onSubmit = async (data: BannerInput) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || 'Failed to create banner')
      } else {
        toast.success('Banner created!')
        router.push('/admin/banners')
        router.refresh()
      }
    } catch {
      toast.error('Failed to create banner')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Add New Banner</h1>
        <p className="text-brand-gray text-sm mt-1">Create a promotional banner for the homepage</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="max-w-2xl flex flex-col gap-6">
          <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                Title *
              </label>
              <input
                {...register('title')}
                className={cn('form-input', errors.title && 'border-red-500')}
                placeholder="Banner title"
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                Subtitle
              </label>
              <input {...register('subtitle')} className="form-input" placeholder="Banner subtitle" />
            </div>

            <div>
              <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                Image URL *
              </label>
              <input
                {...register('image_url')}
                type="url"
                className={cn('form-input', errors.image_url && 'border-red-500')}
                placeholder="https://example.com/image.jpg"
              />
              {errors.image_url && (
                <p className="text-red-400 text-xs mt-1">{errors.image_url.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                Mobile Image URL{' '}
                <span className="text-brand-gray/50 normal-case">(optional)</span>
              </label>
              <input
                {...register('mobile_image_url')}
                type="url"
                className="form-input"
                placeholder="https://example.com/mobile-image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  CTA Text
                </label>
                <input
                  {...register('cta_text')}
                  className="form-input"
                  placeholder="Shop Now"
                />
              </div>
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  CTA URL
                </label>
                <input
                  {...register('cta_url')}
                  className="form-input"
                  placeholder="/women"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
                  Sort Order
                </label>
                <input
                  {...register('sort_order', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="form-input"
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    {...register('is_active')}
                    type="checkbox"
                    className="w-4 h-4 accent-brand-pink"
                  />
                  <span className="text-sm text-brand-gray">Active</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2 px-6 py-3 text-sm font-bold disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Creating...' : 'Create Banner'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-outline flex items-center gap-2 px-6 py-3 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
