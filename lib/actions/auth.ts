"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type LoginResult = { success: false; error: string } | { success: true };

/**
 * Staff sign-in. Only Supabase Auth users with an ACTIVE profile can use the
 * dashboard — RLS (`is_active_user()`) enforces this on every query regardless,
 * but we also check here so an inactive/never-approved user gets a clear
 * message instead of a confusing empty dashboard.
 */
export async function login(fd: FormData): Promise<LoginResult> {
  const email = String(fd.get("email") ?? "").trim();
  const password = String(fd.get("password") ?? "");

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { success: false, error: "Invalid email or password." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile?.is_active) {
    await supabase.auth.signOut();
    return {
      success: false,
      error: "Your account has not been activated yet. Contact your agency admin.",
    };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
