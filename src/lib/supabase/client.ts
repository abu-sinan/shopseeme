'use client'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

let client: ReturnType<typeof createSupabaseClient<Database>> | null = null

/**
 * Creates a singleton Supabase browser client using @supabase/supabase-js directly.
 *
 * WHY not @supabase/ssr createBrowserClient:
 * @supabase/ssr 0.6.x has a TypeScript inference bug where .insert()/.update()
 * resolves to never[] for all tables. Using the direct supabase-js client resolves
 * generics correctly while still working in the browser with localStorage sessions.
 *
 * Auth state is preserved via localStorage (default supabase-js behavior).
 * The middleware still handles session refresh via @supabase/ssr server client.
 */
export function createClient() {
  if (client) return client

  client = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}
