import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { CategorySection } from '@/components/home/CategorySection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { PromoBanner } from '@/components/home/PromoBanner'
import { TrustSection } from '@/components/home/TrustSection'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { MarqueeStrip } from '@/components/home/MarqueeStrip'

export const metadata: Metadata = {
  title: 'ShopSeeMe – Premium Fashion for Men, Women & Kids',
  description:
    'Discover the latest in premium fashion at ShopSeeMe. Shop men\'s, women\'s, and kids\' clothing with fast delivery across Bangladesh. Cash on Delivery available.',
  openGraph: {
    title: 'ShopSeeMe – Premium Fashion',
    description: 'Shop the latest trends in clothing for men, women, and kids.',
    url: 'https://shopseeme.com',
  },
}

// JSON-LD Structured Data for Homepage
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ShopSeeMe',
  url: 'https://shopseeme.com',
  description: 'Premium fashion e-commerce for men, women, and kids in Bangladesh.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://shopseeme.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ShopSeeMe',
  url: 'https://shopseeme.com',
  logo: 'https://shopseeme.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+880-1X-XXXX-XXXX',
    contactType: 'Customer Service',
    availableLanguage: ['English', 'Bengali'],
  },
}

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* Page Sections */}
      <HeroSection />
      <MarqueeStrip />
      <CategorySection />
      <FeaturedProducts />
      <PromoBanner />
      <TrustSection />
      <NewsletterSection />
    </>
  )
}
