import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Loads the current agency user + profile once per request. Wrapped in React
 * `cache()` so the dashboard layout AND the page it renders (plus any server
 * helpers) share a single auth round-trip + profile query instead of repeating
 * them — a meaningful latency win since each call hits Supabase over the network.
 * Returns null if unauthenticated or inactive (the caller decides what to do).
 */
export const getActiveProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) return null;
  return profile;
});

/**
 * Loads the current agency user's profile for use in Server Components /
 * Actions. Redirects to /login if there's no session or the profile isn't
 * active — this is a UX convenience; RLS is the actual security backstop.
 * Backed by the request-cached `getActiveProfile`.
 */
export async function requireActiveProfile(): Promise<Profile> {
  const profile = await getActiveProfile();
  if (!profile) redirect("/login?inactive=1");
  return profile;
}

export function isAdminRole(role: Profile["role"]): boolean {
  return role === "super_admin" || role === "admin";
}
