import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Service-role client: bypasses RLS, so it must never reach the browser.
// `server-only` makes any client-side import a build error. Used only by
// server routes that do privileged writes (currently the blog view
// counter, see supabase/migrations/*_blog_post_views.sql).
//
// Returns null when SUPABASE_SERVICE_ROLE_KEY isn't configured, so callers
// can degrade quietly instead of crashing.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
