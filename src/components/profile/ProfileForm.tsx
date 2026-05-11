'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { User, Mail, Phone, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'
import { profileUpdateSchema, type ProfileUpdateInput } from '@/lib/validations'
import { cn } from '@/utils'
import { formatDate } from '@/utils'
import type { UserProfile } from '@/types'

interface ProfileFormProps {
  profile: UserProfile | null
  userEmail: string
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
    },
  })

  const onSubmit = async (data: ProfileUpdateInput) => {
    setIsLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('You must be logged in')
      setIsLoading(false)
      return
    }

    type UserUpsert = Database['public']['Tables']['users']['Insert']
    const userPayload: UserUpsert = {
      id: user.id,
      email: userEmail,
      full_name: data.full_name,
      phone: data.phone || null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('users')
      .upsert(userPayload)

    if (error) {
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated successfully!')
    }

    setIsLoading(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Card */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-pink/20 border border-brand-pink/30 flex items-center justify-center flex-shrink-0">
            <span className="font-display text-2xl font-bold text-brand-pink">
              {profile?.full_name?.[0]?.toUpperCase() || userEmail[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">
              {profile?.full_name || 'Your Name'}
            </h2>
            <p className="text-brand-gray text-sm">{userEmail}</p>
            <p className="text-brand-gray/60 text-xs mt-0.5">
              Member since {profile?.created_at ? formatDate(profile.created_at) : 'recently'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-brand-pink/5 border border-brand-pink/10 rounded-sm mb-6">
          <div className="w-2 h-2 rounded-full bg-brand-pink" />
          <span className="text-xs text-brand-pink capitalize">
            {profile?.role?.replace('_', ' ') || 'Customer'} Account
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6">
        <h2 className="font-semibold text-white mb-5">Edit Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          {/* Email (read-only) */}
          <div>
            <label className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
              <input
                value={userEmail}
                readOnly
                className="form-input pl-10 opacity-50 cursor-not-allowed"
                aria-label="Email (cannot be changed)"
              />
            </div>
            <p className="text-brand-gray/60 text-xs mt-1">Email cannot be changed</p>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
              <input
                {...register('full_name')}
                id="full_name"
                className={cn('form-input pl-10', errors.full_name && 'border-red-500')}
                placeholder="Your full name"
              />
            </div>
            {errors.full_name && (
              <p className="text-red-400 text-xs mt-1">{errors.full_name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
              <input
                {...register('phone')}
                id="phone"
                type="tel"
                className={cn('form-input pl-10', errors.phone && 'border-red-500')}
                placeholder="01XXXXXXXXX"
              />
            </div>
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-sm font-bold mt-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Quick Links */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6">
        <h2 className="font-semibold text-white mb-4">Quick Links</h2>
        <div className="flex flex-col gap-2">
          <a href="/orders" className="text-sm text-brand-gray hover:text-white transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
            View My Orders
          </a>
          <a href="/men" className="text-sm text-brand-gray hover:text-white transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
            Shop Men&apos;s Collection
          </a>
          <a href="/women" className="text-sm text-brand-gray hover:text-white transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
            Shop Women&apos;s Collection
          </a>
          <a href="/contact" className="text-sm text-brand-gray hover:text-white transition-colors flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
