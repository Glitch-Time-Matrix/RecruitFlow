"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireActiveProfile } from "@/lib/auth/session";
import { uploadDocument } from "@/lib/storage";
import {
  candidateManageSchema,
  experienceEntrySchema,
  educationEntrySchema,
  FILE_RULES,
} from "@/lib/validation/intake";

export type MutationResult =
  | { success: true; id: string }
  | { success: false; error: string };
export type SimpleResult = { success: true } | { success: false; error: string };

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}
function file(fd: FormData, key: string): File | null {
  const v = fd.get(key);
  return v instanceof File && v.size > 0 ? v : null;
}
function checkFile(f: File, rules: { maxBytes: number; mimes: readonly string[]; label: string }): string | null {
  if (f.size > rules.maxBytes) return rules.label;
  if (f.type && !rules.mimes.includes(f.type)) return rules.label;
  return null;
}

/** Map the parsed candidate fields to a DB row payload (shared by create/update). */
function toRow(d: ReturnType<typeof candidateManageSchema.parse>) {
  return {
    full_name: d.fullName,
    email: d.email,
    phone: d.phone,
    location: d.location || null,
    linkedin_url: d.linkedInUrl || null,
    current_title: d.currentTitle || null,
    total_experience: d.totalExperience || null,
    current_employer: d.currentEmployer || null,
    notice_period: d.noticePeriod || null,
    highest_degree: d.highestDegree || null,
    field_of_study: d.fieldOfStudy || null,
    university: d.university || null,
    graduation_year: d.graduationYear || null,
    primary_skills: d.primarySkills,
    secondary_skills: d.secondarySkills || null,
    certifications: d.certifications || null,
    target_role: d.targetRole || null,
    preferred_industry: d.preferredIndustry || null,
    expected_salary: d.expectedSalary || null,
    work_preference: d.workPreference || null,
    status: d.status,
  };
}

function parseCandidate(fd: FormData) {
  return candidateManageSchema.safeParse({
    fullName: str(fd, "fullName"),
    email: str(fd, "email"),
    phone: str(fd, "phone"),
    location: str(fd, "location"),
    linkedInUrl: str(fd, "linkedInUrl"),
    currentTitle: str(fd, "currentTitle"),
    totalExperience: str(fd, "totalExperience"),
    currentEmployer: str(fd, "currentEmployer"),
    noticePeriod: str(fd, "noticePeriod"),
    highestDegree: str(fd, "highestDegree"),
    fieldOfStudy: str(fd, "fieldOfStudy"),
    university: str(fd, "university"),
    graduationYear: str(fd, "graduationYear"),
    primarySkills: str(fd, "primarySkills"),
    secondarySkills: str(fd, "secondarySkills"),
    certifications: str(fd, "certifications"),
    targetRole: str(fd, "targetRole"),
    preferredIndustry: str(fd, "preferredIndustry"),
    expectedSalary: str(fd, "expectedSalary"),
    workPreference: str(fd, "workPreference"),
    status: str(fd, "status") || "new",
  });
}

/**
 * Create a candidate manually from the dashboard (walk-in entry). Writes the
 * row via the RLS-scoped client (so it's attributable + policy-checked), then
 * uploads optional photo/résumé via the admin client to private buckets.
 */
export async function createCandidate(fd: FormData): Promise<MutationResult> {
  await requireActiveProfile();

  const parsed = parseCandidate(fd);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const d = parsed.data;

  const photo = file(fd, "photo");
  const resume = file(fd, "resume");
  if (photo) {
    const e = checkFile(photo, FILE_RULES.photo);
    if (e) return { success: false, error: e };
  }
  if (resume) {
    const e = checkFile(resume, FILE_RULES.resume);
    if (e) return { success: false, error: e };
  }

  try {
    const supabase = await createClient();
    const { data: created, error } = await supabase
      .from("candidates")
      .insert({ ...toRow(d), source: "manual", consent_given: true })
      .select("id")
      .single();
    if (error) return { success: false, error: error.message };
    const id = created.id;

    if (photo) {
      const photoDocId = await uploadDocument({
        f: photo,
        bucket: "candidate-photos",
        kind: "candidate_photo",
        ownerType: "candidate",
        ownerId: id,
      });
      const admin = createAdminClient();
      await admin.from("candidates").update({ photo_document_id: photoDocId }).eq("id", id);
    }
    if (resume) {
      await uploadDocument({
        f: resume,
        bucket: "resumes",
        kind: "resume",
        ownerType: "candidate",
        ownerId: id,
      });
    }

    revalidatePath("/dashboard/candidates");
    return { success: true, id };
  } catch (e) {
    console.error("createCandidate failed:", e);
    return { success: false, error: "Could not create the candidate. Please try again." };
  }
}

/** Update an existing candidate's fields (RLS-scoped). */
export async function updateCandidate(fd: FormData): Promise<MutationResult> {
  await requireActiveProfile();
  const id = str(fd, "id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { success: false, error: "Invalid candidate." };

  const parsed = parseCandidate(fd);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const photo = file(fd, "photo");
  if (photo) {
    const e = checkFile(photo, FILE_RULES.photo);
    if (e) return { success: false, error: e };
  }

  try {
    const supabase = await createClient();
    const { data: updated, error } = await supabase
      .from("candidates")
      .update({ ...toRow(parsed.data), updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id");
    if (error) return { success: false, error: error.message };
    if (!updated || updated.length === 0) {
      return { success: false, error: "Candidate not found or not editable." };
    }

    // Optional new photo replaces the profile photo.
    if (photo) {
      const photoDocId = await uploadDocument({
        f: photo,
        bucket: "candidate-photos",
        kind: "candidate_photo",
        ownerType: "candidate",
        ownerId: id,
      });
      const admin = createAdminClient();
      await admin.from("candidates").update({ photo_document_id: photoDocId }).eq("id", id);
    }

    revalidatePath(`/dashboard/candidates/${id}`);
    revalidatePath("/dashboard/candidates");
    return { success: true, id };
  } catch (e) {
    console.error("updateCandidate failed:", e);
    return { success: false, error: "Could not update the candidate. Please try again." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Structured experience / education (drives the résumé)
// ─────────────────────────────────────────────────────────────────────────────

function nz(v: string): string | null {
  return v.trim() ? v.trim() : null;
}

export async function saveExperience(fd: FormData): Promise<SimpleResult> {
  await requireActiveProfile();
  const candidateId = str(fd, "candidateId");
  const entryId = str(fd, "entryId"); // empty = insert
  if (!/^[0-9a-f-]{36}$/i.test(candidateId)) return { success: false, error: "Invalid candidate." };

  const parsed = experienceEntrySchema.safeParse({
    title: str(fd, "title"),
    company: str(fd, "company"),
    startDate: str(fd, "startDate"),
    endDate: str(fd, "endDate"),
    isCurrent: str(fd, "isCurrent") === "true" || str(fd, "isCurrent") === "on",
    description: str(fd, "description"),
  });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const d = parsed.data;

  const supabase = await createClient();
  const payload = {
    candidate_id: candidateId,
    title: nz(d.title ?? ""),
    company: nz(d.company ?? ""),
    start_date: nz(d.startDate ?? ""),
    end_date: d.isCurrent ? null : nz(d.endDate ?? ""),
    is_current: d.isCurrent ?? false,
    description: nz(d.description ?? ""),
  };

  const { error } = entryId
    ? await supabase.from("candidate_experience").update(payload).eq("id", entryId)
    : await supabase.from("candidate_experience").insert(payload);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/dashboard/candidates/${candidateId}`);
  return { success: true };
}

export async function deleteExperience(id: string, candidateId: string): Promise<SimpleResult> {
  await requireActiveProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("candidate_experience").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/dashboard/candidates/${candidateId}`);
  return { success: true };
}

export async function saveEducation(fd: FormData): Promise<SimpleResult> {
  await requireActiveProfile();
  const candidateId = str(fd, "candidateId");
  const entryId = str(fd, "entryId");
  if (!/^[0-9a-f-]{36}$/i.test(candidateId)) return { success: false, error: "Invalid candidate." };

  const parsed = educationEntrySchema.safeParse({
    degree: str(fd, "degree"),
    fieldOfStudy: str(fd, "fieldOfStudy"),
    institution: str(fd, "institution"),
    graduationYear: str(fd, "graduationYear"),
  });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const d = parsed.data;

  const supabase = await createClient();
  const payload = {
    candidate_id: candidateId,
    degree: nz(d.degree ?? ""),
    field_of_study: nz(d.fieldOfStudy ?? ""),
    institution: nz(d.institution ?? ""),
    graduation_year: nz(d.graduationYear ?? ""),
  };

  const { error } = entryId
    ? await supabase.from("candidate_education").update(payload).eq("id", entryId)
    : await supabase.from("candidate_education").insert(payload);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/dashboard/candidates/${candidateId}`);
  return { success: true };
}

export async function deleteEducation(id: string, candidateId: string): Promise<SimpleResult> {
  await requireActiveProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("candidate_education").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath(`/dashboard/candidates/${candidateId}`);
  return { success: true };
}
