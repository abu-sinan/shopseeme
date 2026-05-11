import React from "react"
import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import '@/styles/globals.css'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://shopseeme.com'
  ),
  title: {
    default: 'ShopSeeMe – Premium Fashion for Men, Women & Kids',
    template: '%s | ShopSeeMe',
  },
  description:
    'Discover premium fashion at ShopSeeMe. Shop the latest trends in clothing for men, women, and kids. Fast delivery across Bangladesh.',
  keywords: [
    'fashion',
    'clothing',
    'Bangladesh',
    'online shopping',
    'men fashion',
    'women fashion',
    'kids clothing',
    'ShopSeeMe',
    'premium fashion',
    'Dhaka fashion',
  ],
  authors: [{ name: 'ShopSeeMe' }],
  creator: 'ShopSeeMe',
  publisher: 'ShopSeeMe',
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    url: 'https://shopseeme.com',
    siteName: 'ShopSeeMe',
    title: 'ShopSeeMe – Premium Fashion for Men, Women & Kids',
    description:
      'Discover premium fashion at ShopSeeMe. Shop the latest trends in clothing for men, women, and kids.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShopSeeMe – Premium Fashion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopSeeMe – Premium Fashion for Men, Women & Kids',
    description: 'Discover premium fashion at ShopSeeMe.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="bg-black text-white antialiased min-h-screen flex flex-col">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-pink focus:text-black focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>

        <Navbar />
        <CartDrawer />

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <Footer />

        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d0d0d',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
