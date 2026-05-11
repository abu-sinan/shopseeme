'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingCart, Image as ImageIcon,
  LogOut, Menu, X, BarChart3, Tag
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/utils'
import { toast } from 'sonner'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
]

interface AdminSidebarProps {
  user: { name: string | null; role: string }
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" className="block">
          <span className="font-display text-xl font-bold">
            <span className="text-white">SHOP</span>
            <span className="text-brand-pink">SEE</span>
            <span className="text-white">ME</span>
          </span>
          <p className="text-[10px] text-brand-gray uppercase tracking-widest mt-0.5">
            Admin Panel
          </p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto" aria-label="Admin navigation">
        <p className="text-[10px] text-brand-gray uppercase tracking-widest px-3 mb-3">Main Menu</p>
        <ul className="flex flex-col gap-1">
          {navItems.map(({ label, href, icon: Icon, exact }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all',
                  isActive(href, exact)
                    ? 'bg-brand-pink/10 text-brand-pink border-l-2 border-brand-pink pl-[10px]'
                    : 'text-brand-gray hover:text-white hover:bg-white/5'
                )}
                aria-current={isActive(href, exact) ? 'page' : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-[10px] text-brand-gray uppercase tracking-widest px-3 mb-3">Quick Actions</p>
          <Link
            href="/admin/products/new"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-brand-gray hover:text-white hover:bg-white/5 transition-all"
          >
            <Tag className="w-4 h-4" />
            Add New Product
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-brand-gray hover:text-white hover:bg-white/5 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            View Storefront
          </Link>
        </div>
      </nav>

      {/* User + Sign Out */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-pink/20 border border-brand-pink/30 flex items-center justify-center flex-shrink-0">
            <span className="text-brand-pink text-xs font-bold">
              {user.name?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{user.name}</p>
            <p className="text-brand-gray text-[10px] capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full text-sm text-brand-gray hover:text-red-400 hover:bg-white/5 px-2 py-2 rounded transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-black border border-white/10 p-2 rounded"
        aria-label="Toggle admin menu"
      >
        {isMobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-[#050505] border-r border-white/10 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-[#050505] border-r border-white/10">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
