'use client'

import Link from 'next/link'
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

const footerLinks = {
  shop: [
    { label: "Men's Collection", href: '/men' },
    { label: "Women's Collection", href: '/women' },
    { label: "Kids' Collection", href: '/kids' },
    { label: 'New Arrivals', href: '/men?filter=new' },
    { label: 'Best Sellers', href: '/women?filter=best' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Careers', href: '/careers' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Return Policy', href: '/returns' },
    { label: 'Track Order', href: '/orders' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/shopseeme', icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com/shopseeme', icon: Facebook },
  { label: 'YouTube', href: 'https://youtube.com/shopseeme', icon: Youtube },
]

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 mt-auto" aria-label="Footer">
      {/* Newsletter Strip */}
      <div className="border-b border-white/5 py-10">
        <div className="container-main">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-white mb-1">
                Join the <span className="text-brand-pink">ShopSeeMe</span> family
              </h3>
              <p className="text-brand-gray text-sm">
                Get exclusive offers, new arrivals & style tips delivered to your inbox.
              </p>
            </div>
            <form
              className="flex w-full md:w-auto gap-0 max-w-md"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 md:w-72 bg-[#0d0d0d] border border-white/10 border-r-0 text-white placeholder:text-brand-gray/50 px-4 py-3 text-sm focus:border-brand-pink focus:outline-none transition-colors rounded-l-sm"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="bg-brand-pink text-black px-5 py-3 hover:bg-brand-pink-light transition-colors flex items-center gap-2 text-sm font-semibold whitespace-nowrap rounded-r-sm"
              >
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-main py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold">
                <span className="text-white">SHOP</span>
                <span className="text-brand-pink">SEE</span>
                <span className="text-white">ME</span>
              </span>
            </Link>
            <p className="text-brand-gray text-sm leading-relaxed mb-6 max-w-xs">
              Premium fashion for the modern Bangladeshi family. Quality clothing
              for men, women, and kids — delivered to your door.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-3 mb-6">
              <a
                href="tel:+8801XXXXXXXXX"
                className="flex items-center gap-2 text-sm text-brand-gray hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-pink flex-shrink-0" />
                +880 1X-XXXX-XXXX
              </a>
              <a
                href="mailto:hello@shopseeme.com"
                className="flex items-center gap-2 text-sm text-brand-gray hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-pink flex-shrink-0" />
                hello@shopseeme.com
              </a>
              <span className="flex items-start gap-2 text-sm text-brand-gray">
                <MapPin className="w-4 h-4 text-brand-pink flex-shrink-0 mt-0.5" />
                Dhaka, Bangladesh
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-brand-gray hover:text-white hover:border-brand-pink hover:bg-brand-pink/10 transition-all rounded-sm"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Shop</h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-gray text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Support</h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-gray text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5 mb-6">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-gray text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Legal</h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-gray text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6">
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-brand-gray text-xs">
            © {new Date().getFullYear()} ShopSeeMe. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Payment method icons */}
            <span className="text-brand-gray text-xs">Accepted payments:</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#0d0d0d] border border-white/10 px-2 py-1 rounded text-white font-medium">
                Cash on Delivery
              </span>
              <span className="text-xs bg-[#E21F63]/20 border border-[#E21F63]/30 px-2 py-1 rounded text-[#E21F63] font-medium">
                bKash
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
