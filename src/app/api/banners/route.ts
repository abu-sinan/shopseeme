import { NextRequest, NextResponse } from 'next/server'
import { createClient, createMutationClient } from '@/lib/supabase/server'
import { bannerSchema } from '@/lib/validations'
import type { Database } from '@/types/supabase'

type BannerInsert = Database['public']['Tables']['banners']['Insert']

export async function POST(request: NextRequest) {
  try {
    // Use cookie client for auth verification
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profileData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const profile = profileData as { role: string } | null
    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = bannerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const d = parsed.data
    const payload: BannerInsert = {
      title: d.title,
      subtitle: d.subtitle || null,
      cta_text: d.cta_text || null,
      cta_url: d.cta_url || null,
      image_url: d.image_url,
      mobile_image_url: d.mobile_image_url || null,
      is_active: d.is_active,
      sort_order: d.sort_order,
    }

    // Use direct client for insert — avoids @supabase/ssr inference issue
    const db = createMutationClient()
    const { error } = await db.from('banners').insert(payload)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
