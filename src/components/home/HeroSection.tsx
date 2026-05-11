'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
      aria-label="Hero section"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />

      {/* Pink Glow */}
      <div
        className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255,79,163,0.5) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container-main relative z-10 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="order-2 lg:order-1"
          >
            {/* New Arrivals Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-semibold uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                <Sparkles className="w-3 h-3" />
                New Collection 2025
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-[clamp(2.8rem,8vw,5.5rem)] font-bold leading-[1.0] tracking-tight text-white mb-6"
            >
              Fashion
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-pink-light">
                That Speaks
              </span>
              <span className="block">For You</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-brand-gray text-lg leading-relaxed mb-8 max-w-md"
            >
              Premium clothing for men, women, and kids. Discover the latest trends
              crafted for the modern Bangladeshi lifestyle.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link
                href="/women"
                className="btn-primary inline-flex items-center gap-2 text-sm font-semibold px-7 py-3.5"
              >
                Shop Women
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/men"
                className="btn-outline inline-flex items-center gap-2 text-sm font-semibold px-7 py-3.5"
              >
                Shop Men
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex gap-8 mt-12 pt-8 border-t border-white/10"
            >
              {[
                { value: '500+', label: 'Products' },
                { value: '10K+', label: 'Happy Customers' },
                { value: 'Fast', label: 'Delivery' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-2xl font-bold text-white">{value}</p>
                  <p className="text-brand-gray text-xs uppercase tracking-wider mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[3/4] max-w-lg mx-auto lg:max-w-none">
              {/* Main Image */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop&q=80"
                  alt="ShopSeeMe premium fashion collection for women"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Floating Card 1 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -left-6 bottom-24 bg-[#0d0d0d] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-sm"
              >
                <p className="text-xs text-brand-gray uppercase tracking-wide mb-1">Bestseller</p>
                <p className="text-white font-semibold text-sm">Summer Collection</p>
                <p className="text-brand-pink font-bold text-lg mt-1">৳ 1,299</p>
              </motion.div>

              {/* Floating Card 2 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="absolute -right-6 top-20 bg-brand-pink/10 border border-brand-pink/30 p-3 rounded-xl shadow-2xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-pink/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-brand-pink" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">New Arrivals</p>
                    <p className="text-brand-gray text-xs">Updated daily</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-brand-gray text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-brand-pink to-transparent" />
      </div>
    </section>
  )
}
