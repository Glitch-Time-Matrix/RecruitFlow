import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Stateless anon Supabase client for PUBLIC reads (e.g. published job listings).
 * No cookies/session, so pages using it can be statically cached and revalidated
 * (ISR). Access is still constrained by RLS: as the `anon` role, this can only
 * read rows public policies allow — for jobs, that's `is_published = true`.
 */
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
