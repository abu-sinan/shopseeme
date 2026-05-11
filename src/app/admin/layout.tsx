import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { template: '%s | ShopSeeMe Admin', default: 'Admin Dashboard | ShopSeeMe' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirectedFrom=/admin')

  const { data } = await supabase
    .from('users')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  const profile = data as { role: string; full_name: string | null; email: string } | null

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    redirect('/?error=unauthorized')
  }

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar user={{ name: profile.full_name ?? profile.email, role: profile.role }} />
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="p-4 md:p-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </div>
  )
}
