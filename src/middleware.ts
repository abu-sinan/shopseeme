import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware handles:
 * 1. Supabase session refresh
 * 2. Auth-required route protection
 * 3. Admin route protection with role validation
 * 4. Guest-only route redirection for logged-in users
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Skip middleware for static assets
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|webp|svg|css|js|woff|woff2)$/)
  ) {
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Refresh session — required for SSR auth
    const { data: { user } } = await supabase.auth.getUser()

    // ---- Admin Route Protection ----
    if (pathname.startsWith('/admin')) {
      if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirectedFrom', pathname)
        return NextResponse.redirect(url)
      }

      // Fetch role from DB — wrapped in try so a DB outage doesn't crash the app
      try {
        const { data: profileData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        const profile = profileData as { role: string } | null

        if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
          const url = request.nextUrl.clone()
          url.pathname = '/'
          url.searchParams.set('error', 'unauthorized')
          return NextResponse.redirect(url)
        }
      } catch {
        // DB unavailable — deny admin access safely
        const url = request.nextUrl.clone()
        url.pathname = '/'
        url.searchParams.set('error', 'unauthorized')
        return NextResponse.redirect(url)
      }
    }

    // ---- Auth-Required Routes ----
    const protectedRoutes = ['/profile', '/orders', '/checkout']
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    )
    if (isProtectedRoute && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(url)
    }

    // ---- Guest-Only Routes ----
    const guestRoutes = ['/login', '/register']
    if (guestRoutes.includes(pathname) && user) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

  } catch {
    // Supabase connection failed (e.g. unconfigured env vars)
    // Allow request to proceed — pages will handle missing data gracefully
    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
}
