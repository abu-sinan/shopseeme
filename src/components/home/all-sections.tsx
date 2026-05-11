'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Truck, RotateCcw, ShieldCheck, CreditCard, Sparkles } from 'lucide-react'

// ──────────────────────────────────────────────
// MARQUEE STRIP
// ──────────────────────────────────────────────
const marqueeItems = [
  '✦ FREE SHIPPING ON ORDERS OVER ৳2000',
  '✦ NEW ARRIVALS EVERY WEEK',
  '✦ CASH ON DELIVERY AVAILABLE',
  '✦ EASY 7-DAY RETURNS',
  '✦ PREMIUM QUALITY GUARANTEED',
  '✦ SHOP MEN · WOMEN · KIDS',
]

export function MarqueeStrip() {
  const items = [...marqueeItems, ...marqueeItems]
  return (
    <div
      className="bg-brand-pink text-black py-2.5 overflow-hidden whitespace-nowrap"
      aria-label="Promotions and offers"
    >
      <div className="inline-flex animate-marquee gap-12">
        {items.map((item, i) => (
          <span key={i} className="text-xs font-bold uppercase tracking-widest flex-shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// CATEGORY SECTION
// ──────────────────────────────────────────────
const categories = [
  {
    label: "Men's",
    href: '/men',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=750&fit=crop&q=80',
    description: 'Sharp fits for the modern man',
  },
  {
    label: "Women's",
    href: '/women',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=750&fit=crop&q=80',
    description: 'Elegant styles for every occasion',
  },
  {
    label: "Kids'",
    href: '/kids',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&h=750&fit=crop&q=80',
    description: 'Fun & comfortable for little ones',
  },
]

export function CategorySection() {
  return (
    <section className="py-20 bg-black" aria-labelledby="categories-heading">
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="section-subheading mb-3">Shop by Category</p>
          <h2 id="categories-heading" className="section-heading">
            Find Your <span className="text-brand-pink">Style</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <Link
                href={cat.href}
                className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-[#0d0d0d]"
                aria-label={`Shop ${cat.label} collection`}
              >
                <Image
                  src={cat.image}
                  alt={`${cat.label} Fashion at ShopSeeMe`}
                  fill
                  className="object-cover transition-transform duration-700 ease-expo-out group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 400px"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-brand-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-3xl font-bold text-white mb-1">
                    {cat.label}
                  </h3>
                  <p className="text-brand-gray text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-brand-pink text-sm font-semibold">
                    Shop Now <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// FEATURED PRODUCTS (Static demo - will be dynamic)
// ──────────────────────────────────────────────
const demoProducts = [
  {
    id: '1', title: 'Oversized Premium Hoodie', slug: 'oversized-premium-hoodie',
    price: 1899, discount_price: 1499, gender: 'men',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&q=80',
    badge: 'New',
  },
  {
    id: '2', title: 'Floral Wrap Dress', slug: 'floral-wrap-dress',
    price: 2299, discount_price: 1799, gender: 'women',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop&q=80',
    badge: 'Trending',
  },
  {
    id: '3', title: 'Slim Fit Polo Shirt', slug: 'slim-fit-polo-shirt',
    price: 999, discount_price: null, gender: 'men',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop&q=80',
    badge: null,
  },
  {
    id: '4', title: 'Kids Denim Jacket', slug: 'kids-denim-jacket',
    price: 1599, discount_price: 1299, gender: 'kids',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&h=500&fit=crop&q=80',
    badge: 'Sale',
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-[#050505]" aria-labelledby="featured-heading">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-subheading mb-3">Handpicked for You</p>
            <h2 id="featured-heading" className="section-heading">
              Featured <span className="text-brand-pink">Products</span>
            </h2>
          </div>
          <Link
            href="/men"
            className="inline-flex items-center gap-2 text-brand-pink text-sm font-semibold hover:gap-3 transition-all"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {demoProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/products/${product.slug}`}
                className="group block product-card"
                aria-label={`${product.title} - ৳${product.discount_price || product.price}`}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#0d0d0d]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="product-card-image group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                  />
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="badge-pink">{product.badge}</span>
                    </div>
                  )}
                  {/* Discount badge */}
                  {product.discount_price && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5">
                        {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                      </span>
                    </div>
                  )}
                  {/* Quick add overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/80 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    Quick View
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-brand-gray uppercase tracking-wide mb-1">
                    {product.gender}
                  </p>
                  <h3 className="text-sm font-medium text-white line-clamp-1 mb-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      ৳{(product.discount_price || product.price).toLocaleString()}
                    </span>
                    {product.discount_price && (
                      <span className="text-xs text-brand-gray line-through">
                        ৳{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// PROMO BANNER
// ──────────────────────────────────────────────
export function PromoBanner() {
  return (
    <section className="py-12 bg-black" aria-label="Promotional offer">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-pink/20 to-black border border-brand-pink/20 p-8 md:p-12"
        >
          {/* Background glow */}
          <div
            className="absolute -right-20 -top-20 w-96 h-96 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(255,79,163,0.6) 0%, transparent 70%)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-brand-pink text-sm font-semibold uppercase tracking-widest mb-3">
                <Sparkles className="w-4 h-4" /> Limited Offer
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">
                Up to <span className="text-brand-pink">40% Off</span>
                <br />New Arrivals
              </h2>
              <p className="text-brand-gray">
                Shop the latest styles at unbeatable prices. Limited time only.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link href="/women?filter=new" className="btn-primary text-center px-10 py-3.5">
                Shop Women
              </Link>
              <Link href="/men?filter=new" className="btn-outline text-center px-10 py-3.5">
                Shop Men
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// TRUST SECTION
// ──────────────────────────────────────────────
const trustItems = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Delivered to your door across Bangladesh within 2-5 days',
  },
  {
    icon: CreditCard,
    title: 'Cash on Delivery',
    description: 'Pay when you receive — no upfront payment needed',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Checkout',
    description: 'Your payment and data are always 100% safe with us',
  },
  {
    icon: RotateCcw,
    title: '7-Day Returns',
    description: 'Not happy? Return within 7 days, no questions asked',
  },
]

export function TrustSection() {
  return (
    <section className="py-16 bg-[#050505] border-y border-white/5" aria-label="Why shop with us">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand-pink" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                <p className="text-brand-gray text-xs leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// NEWSLETTER SECTION
// ──────────────────────────────────────────────
export function NewsletterSection() {
  return (
    <section className="py-20 bg-black" aria-labelledby="newsletter-heading">
      <div className="container-main">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-brand-pink text-xs font-semibold uppercase tracking-widest mb-4">
            <Star className="w-3 h-3 fill-brand-pink" /> Stay in the Loop
          </span>
          <h2 id="newsletter-heading" className="section-heading mb-4">
            Get Exclusive
            <span className="text-brand-pink"> Offers</span>
          </h2>
          <p className="text-brand-gray mb-8">
            Subscribe and be the first to know about new arrivals, special offers,
            and style tips from ShopSeeMe.
          </p>

          <form
            className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter subscription"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 bg-[#0d0d0d] border border-white/10 border-r-0 text-white placeholder:text-brand-gray/50 px-5 py-3.5 focus:border-brand-pink focus:outline-none transition-colors text-sm rounded-l-sm sm:rounded-none"
            />
            <button
              type="submit"
              className="btn-primary text-sm px-6 py-3.5 whitespace-nowrap rounded-r-sm sm:rounded-none"
            >
              Subscribe
            </button>
          </form>

          <p className="text-brand-gray/50 text-xs mt-4">
            No spam ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
