import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Stateless anon Supabase client for PUBLIC reads (e.g. published job listings).
 * No cookies/session, so pages using it can be statically cached and revalidated
 * (ISR). Access is still constrained by RLS: as the `anon` role, this can only
 * read rows public policies allow — for jobs, that's `is_published = true`.
 *
 * Returns `null` if the Supabase env vars are absent (e.g. during a Vercel build
 * step where they aren't exposed). Callers treat a null client as "no data yet"
 * so a build never hard-fails on an unreachable data source — the pages then
 * render on demand via ISR once the runtime env is present.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
