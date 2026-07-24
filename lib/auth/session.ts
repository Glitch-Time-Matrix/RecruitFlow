import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Loads the current agency user's profile for use in Server Components.
 * Redirects to /login if there's no session or the profile isn't active —
 * this is a UX convenience; RLS is the actual security backstop.
 */
export async function requireActiveProfile(): Promise<Profile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) redirect("/login?inactive=1");

  return profile;
}

export function isAdminRole(role: Profile["role"]): boolean {
  return role === "super_admin" || role === "admin";
}
