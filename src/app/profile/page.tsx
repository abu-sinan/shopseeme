import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/profile/ProfileForm'
import type { UserProfile } from '@/types'

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your ShopSeeMe account profile.',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirectedFrom=/profile')

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = data as UserProfile | null

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="container-main py-10 max-w-2xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-10">My Profile</h1>
        <ProfileForm profile={profile} userEmail={user.email ?? ''} />
      </div>
    </div>
  )
}
