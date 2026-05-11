'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  Settings,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/utils'
import type { UserProfile } from '@/types'

const navLinks = [
  { label: 'Men', href: '/men' },
  { label: 'Women', href: '/women' },
  { label: 'Kids', href: '/kids' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { getTotalItems, openCart } = useCartStore()
  const cartCount = getTotalItems()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()
        setUser(profile)
      }
    }
    
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setUser(profile)
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-black/95 backdrop-blur-md border-b border-white/5 shadow-lg'
            : 'bg-transparent'
        )}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group flex-shrink-0"
              aria-label="ShopSeeMe Home"
            >
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl md:text-2xl font-bold tracking-tight">
                  <span className="text-white">SHOP</span>
                  <span className="text-brand-pink">SEE</span>
                  <span className="text-white">ME</span>
                </span>
                <span className="text-[0.5rem] tracking-[0.3em] text-brand-gray uppercase font-medium opacity-70">
                  Premium Fashion
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium uppercase tracking-wider transition-colors duration-200 relative group',
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-white'
                      : 'text-brand-gray hover:text-white'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 h-px bg-brand-pink transition-all duration-300',
                      pathname === link.href || pathname.startsWith(link.href + '/')
                        ? 'w-full'
                        : 'w-0 group-hover:w-full'
                    )}
                  />
                </Link>
              ))}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 md:p-2.5 text-brand-gray hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div className="relative hidden md:block">
                {user ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2.5 text-brand-gray hover:text-white transition-colors flex items-center gap-1"
                    aria-expanded={isUserMenuOpen}
                    aria-label="User menu"
                  >
                    <User className="w-5 h-5" />
                    <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', isUserMenuOpen && 'rotate-180')} />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="p-2.5 text-brand-gray hover:text-white transition-colors"
                    aria-label="Login"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}

                <AnimatePresence>
                  {isUserMenuOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-[#0d0d0d] border border-white/10 shadow-2xl py-2 rounded-sm"
                    >
                      <div className="px-4 py-2 border-b border-white/10 mb-1">
                        <p className="text-xs text-brand-gray">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.full_name || user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-gray hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-gray hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>
                      {(user.role === 'admin' || user.role === 'super_admin') && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-pink hover:bg-brand-pink/10 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-white/10 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-brand-gray hover:text-red-400 hover:bg-white/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-2 md:p-2.5 text-brand-gray hover:text-white transition-colors"
                aria-label={`Shopping cart, ${cartCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-pink text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-brand-gray hover:text-white transition-colors ml-1"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 bg-black md:hidden"
          >
            <div className="flex flex-col h-full pt-20 pb-8 px-6 overflow-y-auto">
              <nav className="flex flex-col gap-2 mb-8" aria-label="Mobile navigation">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.07 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'block font-display text-4xl font-bold py-2 transition-colors',
                        pathname === link.href ? 'text-brand-pink' : 'text-white hover:text-brand-pink'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
                {user ? (
                  <>
                    <p className="text-brand-gray text-sm">
                      Hello, <span className="text-white">{user.full_name || 'there'}</span>
                    </p>
                    <Link href="/profile" className="text-sm text-brand-gray hover:text-white transition-colors">My Profile</Link>
                    <Link href="/orders" className="text-sm text-brand-gray hover:text-white transition-colors">My Orders</Link>
                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <Link href="/admin" className="text-sm text-brand-pink">Admin Panel</Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="text-sm text-red-400 text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      href="/login"
                      className="flex-1 btn-outline text-center text-sm py-3"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1 btn-primary text-center text-sm py-3"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start justify-center pt-24 px-4"
            onClick={(e) => e.target === e.currentTarget && setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  autoFocus
                  className="w-full bg-[#0d0d0d] border border-white/20 text-white text-lg px-12 py-4 focus:border-brand-pink focus:outline-none rounded-sm"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
              <p className="text-brand-gray text-sm mt-3 text-center">
                Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-xs">Enter</kbd> to search
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsUserMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
