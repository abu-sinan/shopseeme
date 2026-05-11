import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { bannerSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify admin role server-side
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

    const data = parsed.data
    const { error } = await supabase.from('banners').insert({
      title: data.title,
      subtitle: data.subtitle || null,
      cta_text: data.cta_text || null,
      cta_url: data.cta_url || null,
      image_url: data.image_url,
      mobile_image_url: data.mobile_image_url || null,
      is_active: data.is_active,
      sort_order: data.sort_order,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
