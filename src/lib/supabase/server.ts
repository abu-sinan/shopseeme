import { createServerClient } from '@supabase/ssr'
import { createClient as createDirectClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

/**
 * Creates a Supabase server client for use in:
 * - Server Components (reads, auth checks)
 * - Route Handlers (auth verification)
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Can be ignored in Server Components — middleware handles refresh
          }
        },
      },
    }
  )
}

/**
 * Creates a direct Supabase client using @supabase/supabase-js (NOT @supabase/ssr).
 * Use this for INSERT/UPDATE/DELETE in API Route Handlers.
 *
 * WHY: @supabase/ssr 0.6.x has a TypeScript inference bug where
 * .insert()/.update() resolves to never[] via createServerClient.
 * The direct @supabase/supabase-js client resolves generics correctly.
 *
 * Uses the anon key + RLS for security (same as the cookie client).
 */
export function createMutationClient() {
  return createDirectClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}

/**
 * Creates a Supabase admin client with service_role key.
 * ONLY USE IN SECURE SERVER-SIDE CODE — NEVER EXPOSE TO CLIENT.
 */
export function createAdminClient() {
  return createDirectClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
