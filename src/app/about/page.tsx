import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us – Our Story',
  description: 'Learn about ShopSeeMe – a premium fashion brand built for the modern Bangladeshi. Our story, mission, and values.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&h=600&fit=crop&q=80"
          alt="ShopSeeMe premium fashion store"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <p className="section-subheading mb-3">Our Story</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white">About ShopSeeMe</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container-main py-20">
        <div className="max-w-3xl mx-auto">
          {/* Mission */}
          <div className="text-center mb-16">
            <p className="section-subheading mb-3">Our Mission</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              Fashion That <span className="text-brand-pink">Empowers</span>
            </h2>
            <p className="text-brand-gray text-lg leading-relaxed">
              ShopSeeMe was born from a simple belief: everyone deserves access to premium,
              stylish fashion — without compromise. We curate the finest clothing for men,
              women, and kids, bringing international-quality fashion to Bangladesh at fair prices.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: '✦',
                title: 'Quality First',
                desc: 'Every piece in our collection is hand-selected for quality, fit, and lasting style.',
              },
              {
                icon: '♥',
                title: 'Made for You',
                desc: 'We design collections that reflect the diverse and vibrant Bangladeshi lifestyle.',
              },
              {
                icon: '→',
                title: 'Fast & Reliable',
                desc: 'Nationwide delivery with real-time tracking. Your fashion, on time, every time.',
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#0d0d0d] border border-white/5 rounded-sm p-6 text-center"
              >
                <span className="text-brand-pink text-2xl mb-3 block">{icon}</span>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-brand-gray text-sm">{desc}</p>
              </div>
            ))}
          </div>

          {/* Story */}
          <div className="prose prose-invert prose-lg max-w-none mb-16">
            <h2 className="font-display text-2xl font-bold text-white mb-4">How It All Started</h2>
            <p className="text-brand-gray leading-relaxed mb-4">
              ShopSeeMe started with a vision to bridge the gap between high-end international
              fashion and everyday Bangladeshi shoppers. We saw countless people scrolling
              through foreign fashion sites, wishing they could shop without worrying about
              authenticity, delivery, or after-sales support.
            </p>
            <p className="text-brand-gray leading-relaxed mb-4">
              So we built ShopSeeMe — a fully local premium fashion brand, designed from the
              ground up for Bangladesh. With Cash on Delivery, bKash support, and fast delivery
              to every district, we made premium fashion accessible to everyone.
            </p>
            <p className="text-brand-gray leading-relaxed">
              Today, we proudly serve thousands of happy customers across Bangladesh,
              offering hundreds of premium products for men, women, and kids.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/women" className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-sm font-bold">
              Explore Our Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
