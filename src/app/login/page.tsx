'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { cn } from '@/utils'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectedFrom') || '/'
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast.error(
        error.message === 'Invalid login credentials'
          ? 'Incorrect email or password'
          : error.message
      )
      setIsLoading(false)
      return
    }

    toast.success('Welcome back!')
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <span className="font-display text-3xl font-bold">
              <span className="text-white">SHOP</span>
              <span className="text-brand-pink">SEE</span>
              <span className="text-white">ME</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-brand-gray text-sm mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="block text-xs text-brand-gray uppercase tracking-wide mb-2">
              Email Address
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
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-xs text-brand-gray uppercase tracking-wide">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-brand-pink hover:text-brand-pink-light transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className={cn('form-input pl-10 pr-10', errors.password && 'border-red-500')}
                placeholder="••••••••"
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
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3.5 text-sm font-bold mt-2 disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-brand-gray text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-brand-pink hover:text-brand-pink-light transition-colors font-medium">
            Create one
          </Link>
        </p>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-brand-gray text-xs">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <Link href="/checkout" className="w-full btn-outline py-3.5 text-sm font-medium text-center block">
          Continue as Guest
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
