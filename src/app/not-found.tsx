import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 – Page Not Found',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-16">
      <div className="text-center max-w-md">
        <div className="font-display text-[8rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent mb-6 select-none">
          404
        </div>
        <h1 className="font-display text-3xl font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-brand-gray mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to shopping.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary px-8 py-3 text-sm">
            Go Home
          </Link>
          <Link href="/women" className="btn-outline px-8 py-3 text-sm">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  )
}
