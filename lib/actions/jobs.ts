"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireActiveProfile, isAdminRole } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";
import type { Database } from "@/lib/database.types";

type HiringStatus = Database["public"]["Enums"]["hiring_request_status"];
export type ActionResult =
  | { success: true; slug?: string }
  | { success: false; error: string };

/** Approve / reject / mark under review. Any active staff user may triage. */
export async function reviewHiringRequest(
  id: string,
  status: Extract<HiringStatus, "under_review" | "approved" | "rejected">,
): Promise<ActionResult> {
  const profile = await requireActiveProfile();
  const supabase = await createClient();
  const { error } = await supabase
    .from("hiring_requests")
    .update({ status, reviewed_by: profile.id })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/dashboard/hiring-requests/${id}`);
  revalidatePath("/dashboard/hiring-requests");
  return { success: true };
}

/** Ensure a slug is unique among jobs by appending -2, -3, … on collision. */
async function uniqueSlug(base: string): Promise<string> {
  const supabase = await createClient();
  const root = slugify(base) || "job";
  let candidate = root;
  let n = 1;
  // Bounded loop; slugs are few and this only runs on publish.
  while (n < 50) {
    const { data } = await supabase.from("jobs").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
  return `${root}-${Date.now().toString(36)}`;
}

/**
 * Convert an approved hiring request into a PUBLISHED public job. Only admins
 * may publish (RLS on `jobs` also enforces this). Only candidate-safe fields are
 * written — employer identity/contacts never appear in the job.
 */
export async function publishJobFromRequest(fd: FormData): Promise<ActionResult> {
  const profile = await requireActiveProfile();
  if (!isAdminRole(profile.role)) {
    return { success: false, error: "Only admins can publish jobs to the public site." };
  }

  const requestId = String(fd.get("requestId") ?? "");
  const title = String(fd.get("title") ?? "").trim();
  if (!requestId || !title) return { success: false, error: "A job title is required." };

  const supabase = await createClient();
  const { data: request } = await supabase
    .from("hiring_requests")
    .select("id, employer_id")
    .eq("id", requestId)
    .maybeSingle();
  if (!request) return { success: false, error: "Hiring request not found." };

  const requirements = String(fd.get("requirements") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const slug = await uniqueSlug(title);

  const { error } = await supabase.from("jobs").insert({
    hiring_request_id: requestId,
    employer_id: request.employer_id,
    slug,
    title,
    department: String(fd.get("department") ?? "").trim() || null,
    location: String(fd.get("location") ?? "").trim() || null,
    salary_display: String(fd.get("salary_display") ?? "").trim() || null,
    type: String(fd.get("type") ?? "").trim() || null,
    description: String(fd.get("description") ?? "").trim() || null,
    requirements,
    is_published: true,
    published_at: new Date().toISOString(),
    created_by: profile.id,
  });
  if (error) return { success: false, error: error.message };

  await supabase.from("hiring_requests").update({ status: "published" }).eq("id", requestId);

  // Refresh the public site + dashboard views.
  revalidatePath("/jobs");
  revalidatePath("/dashboard/jobs");
  revalidatePath("/dashboard/hiring-requests");
  revalidatePath(`/dashboard/hiring-requests/${requestId}`);
  return { success: true, slug };
}

async function setPublished(jobId: string, isPublished: boolean): Promise<ActionResult> {
  const profile = await requireActiveProfile();
  if (!isAdminRole(profile.role)) {
    return { success: false, error: "Only admins can change job publication." };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("jobs")
    .update({
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    .eq("id", jobId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/jobs");
  revalidatePath("/dashboard/jobs");
  return { success: true };
}

export async function unpublishJob(jobId: string) {
  return setPublished(jobId, false);
}

export async function republishJob(jobId: string) {
  return setPublished(jobId, true);
}
