import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * SERVER-ONLY Supabase client using the SERVICE ROLE key.
 *
 * This bypasses Row-Level Security, so it must ONLY be used inside trusted
 * server code (public form intake, admin tasks). The `server-only` import above
 * makes the build fail if this file is ever imported into a Client Component.
 * The service-role key is read from a non-public env var, so it never reaches
 * the browser bundle.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client is not configured: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
