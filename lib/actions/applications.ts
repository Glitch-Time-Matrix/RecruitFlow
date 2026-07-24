"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireActiveProfile } from "@/lib/auth/session";
import type { Database } from "@/lib/database.types";

type Stage = Database["public"]["Enums"]["application_stage"];

export type StageResult = { success: true } | { success: false; error: string };

/** Move an application to a new pipeline stage. RLS scopes which apps are writable. */
export async function updateApplicationStage(id: string, stage: Stage): Promise<StageResult> {
  await requireActiveProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("applications").update({ stage }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/applications");
  return { success: true };
}
