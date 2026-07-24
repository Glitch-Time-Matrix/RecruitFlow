"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireActiveProfile } from "@/lib/auth/session";
import { uploadDocument } from "@/lib/storage";
import { employerManageSchema, FILE_RULES } from "@/lib/validation/intake";

export type MutationResult =
  | { success: true; id: string }
  | { success: false; error: string };

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

function parse(fd: FormData) {
  return employerManageSchema.safeParse({
    companyName: str(fd, "companyName"),
    industry: str(fd, "industry"),
    companyScale: str(fd, "companyScale"),
    websiteUrl: str(fd, "websiteUrl"),
    status: str(fd, "status") || "prospect",
    contactName: str(fd, "contactName"),
    designation: str(fd, "designation"),
    contactEmail: str(fd, "contactEmail"),
    contactPhone: str(fd, "contactPhone"),
  });
}

function toRow(d: ReturnType<typeof employerManageSchema.parse>) {
  return {
    company_name: d.companyName,
    industry: d.industry || null,
    company_scale: d.companyScale || null,
    website_url: d.websiteUrl || null,
    status: d.status,
  };
}

/**
 * Create an employer manually from the dashboard, with an optional primary
 * contact and logo. The employer row + contact go through the RLS-scoped client
 * (the contact insert is additionally gated by the employer_contacts policy);
 * the logo file goes to a private bucket via the admin client.
 */
export async function createEmployer(fd: FormData): Promise<MutationResult> {
  await requireActiveProfile();

  const parsed = parse(fd);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const d = parsed.data;

  const logo = file(fd, "logo");
  if (logo) {
    const e = checkFile(logo, FILE_RULES.photo);
    if (e) return { success: false, error: e };
  }

  try {
    const supabase = await createClient();
    const { data: created, error } = await supabase
      .from("employers")
      .insert({ ...toRow(d), source: "manual" })
      .select("id")
      .single();
    if (error) return { success: false, error: error.message };
    const id = created.id;

    // Optional primary contact (may be blocked by RLS for recruiters lacking
    // the employer_contacts grant — that's acceptable; the employer still saved).
    if (d.contactName || d.contactEmail || d.contactPhone) {
      await supabase.from("employer_contacts").insert({
        employer_id: id,
        contact_name: d.contactName || null,
        designation: d.designation || null,
        email: d.contactEmail || null,
        phone: d.contactPhone || null,
        is_primary: true,
      });
    }

    if (logo) {
      const logoDocId = await uploadDocument({
        f: logo,
        bucket: "employer-logos",
        kind: "employer_logo",
        ownerType: "employer",
        ownerId: id,
      });
      const admin = createAdminClient();
      await admin.from("employers").update({ logo_document_id: logoDocId }).eq("id", id);
    }

    revalidatePath("/dashboard/employers");
    return { success: true, id };
  } catch (e) {
    console.error("createEmployer failed:", e);
    return { success: false, error: "Could not create the employer. Please try again." };
  }
}

/**
 * Update an employer's fields (RLS-scoped) and, if provided, upsert its primary
 * contact. Contact writes are gated by the employer_contacts policy.
 */
export async function updateEmployer(fd: FormData): Promise<MutationResult> {
  await requireActiveProfile();
  const id = str(fd, "id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { success: false, error: "Invalid employer." };

  const parsed = parse(fd);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const d = parsed.data;

  const logo = file(fd, "logo");
  if (logo) {
    const e = checkFile(logo, FILE_RULES.photo);
    if (e) return { success: false, error: e };
  }

  try {
    const supabase = await createClient();
    const { data: updated, error } = await supabase
      .from("employers")
      .update({ ...toRow(d), updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id");
    if (error) return { success: false, error: error.message };
    if (!updated || updated.length === 0) {
      return { success: false, error: "Employer not found or not editable." };
    }

    // Upsert the primary contact if any contact field is provided.
    if (d.contactName || d.contactEmail || d.contactPhone) {
      const { data: existing } = await supabase
        .from("employer_contacts")
        .select("id")
        .eq("employer_id", id)
        .eq("is_primary", true)
        .maybeSingle();

      const payload = {
        contact_name: d.contactName || null,
        designation: d.designation || null,
        email: d.contactEmail || null,
        phone: d.contactPhone || null,
      };
      if (existing) {
        await supabase.from("employer_contacts").update(payload).eq("id", existing.id);
      } else {
        await supabase
          .from("employer_contacts")
          .insert({ employer_id: id, is_primary: true, ...payload });
      }
    }

    if (logo) {
      const logoDocId = await uploadDocument({
        f: logo,
        bucket: "employer-logos",
        kind: "employer_logo",
        ownerType: "employer",
        ownerId: id,
      });
      const admin = createAdminClient();
      await admin.from("employers").update({ logo_document_id: logoDocId }).eq("id", id);
    }

    revalidatePath(`/dashboard/employers/${id}`);
    revalidatePath("/dashboard/employers");
    return { success: true, id };
  } catch (e) {
    console.error("updateEmployer failed:", e);
    return { success: false, error: "Could not update the employer. Please try again." };
  }
}
