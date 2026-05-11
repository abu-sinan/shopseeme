'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, Mail, User, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import { cn } from '@/utils'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    const supabase = createClient()

    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          phone: data.phone || null,
        },
      },
    })

    if (signUpError) {
      toast.error(
        signUpError.message.includes('already registered')
          ? 'This email is already registered. Try logging in.'
          : signUpError.message
      )
      setIsLoading(false)
      return
    }

    toast.success('Account created! Welcome to ShopSeeMe!')
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-16 pb-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <span className="font-display text-3xl font-bold">
              <span className="text-white">SHOP</span>
              <span className="text-brand-pink">SEE</span>
              <span className="text-white">ME</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">Create Account</h1>
          <p className="text-brand-gray text-sm mt-2">Join ShopSeeMe and shop premium fashion</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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
                type="text"
                autoComplete="name"
                className={cn('form-input pl-10', errors.full_name && 'border-red-500')}
                placeholder="Your full name"
              />
            </div>
            {errors.full_name && (
              <p className="text-red-400 text-xs mt-1">{errors.full_name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className={cn('form-input pl-10', errors.email && 'border-red-500')}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
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
                autoComplete="tel"
                className={cn('form-input pl-10', errors.phone && 'border-red-500')}
                placeholder="01XXXXXXXXX"
              />
            </div>
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={cn('form-input pl-10 pr-10', errors.password && 'border-red-500')}
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm_password" className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
              <input
                {...register('confirm_password')}
                id="confirm_password"
                type="password"
                autoComplete="new-password"
                className={cn('form-input pl-10', errors.confirm_password && 'border-red-500')}
                placeholder="Repeat your password"
              />
            </div>
            {errors.confirm_password && (
              <p className="text-red-400 text-xs mt-1">{errors.confirm_password.message}</p>
            )}
          </div>

          <p className="text-brand-gray text-xs">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-brand-pink hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-brand-pink hover:underline">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3.5 text-sm font-bold mt-2 disabled:opacity-60"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-brand-gray text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-pink hover:text-brand-pink-light transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
