"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireActiveProfile } from "@/lib/auth/session";
import { getResumeData } from "@/lib/db/candidates";
import { renderResumeHtml } from "@/lib/resume/template";
import { FILE_RULES } from "@/lib/validation/intake";
import type { Database } from "@/lib/database.types";

type DocumentKind = Database["public"]["Enums"]["document_kind"];

export type ActionResult = { success: true } | { success: false; error: string };

/** Which upload kinds a recruiter may add from the candidate detail page. */
const UPLOADABLE_KINDS: Record<string, { rules: (typeof FILE_RULES)[keyof typeof FILE_RULES]; kind: DocumentKind; bucket: string }> = {
  resume: { rules: FILE_RULES.resume, kind: "resume", bucket: "resumes" },
  certificate: { rules: FILE_RULES.resume, kind: "certificate", bucket: "resumes" },
  other: { rules: FILE_RULES.resume, kind: "other", bucket: "resumes" },
};

function checkFile(f: File, rules: { maxBytes: number; mimes: readonly string[]; label: string }): string | null {
  if (f.size > rules.maxBytes) return rules.label;
  if (f.type && !rules.mimes.includes(f.type)) return rules.label;
  return null;
}

/**
 * Generate a branded HTML résumé for a candidate from their structured data and
 * store it as a `generated_resume` document. Overwrites any prior generated
 * résumé (a candidate has at most one current generated résumé on file).
 *
 * Access is enforced by RLS: the caller must be able to read the candidate via
 * the authenticated server client; only then do we use the admin client to write
 * to the private storage bucket. `uploaded_by` is stamped so the recruiter can
 * later delete their own generated file even without admin rights.
 */
export async function generateResume(candidateId: string): Promise<ActionResult> {
  const profile = await requireActiveProfile();

  // RLS gate: this returns null if the caller can't see the candidate.
  const data = await getResumeData(candidateId);
  if (!data) return { success: false, error: "Candidate not found or not accessible." };

  const html = renderResumeHtml(data);
  const bytes = Buffer.from(html, "utf-8");
  const bucket = "resumes";
  const path = `${candidateId}/generated-${crypto.randomUUID()}.html`;

  const admin = createAdminClient();

  try {
    // Remove any previous generated résumé (storage object + document row).
    const { data: prior } = await admin
      .from("documents")
      .select("id, storage_bucket, storage_path")
      .eq("owner_type", "candidate")
      .eq("owner_id", candidateId)
      .eq("kind", "generated_resume");
    if (prior && prior.length > 0) {
      await admin.storage
        .from(bucket)
        .remove(prior.map((p) => p.storage_path).filter(Boolean));
      await admin
        .from("documents")
        .delete()
        .in("id", prior.map((p) => p.id));
    }

    const { error: upErr } = await admin.storage.from(bucket).upload(path, bytes, {
      contentType: "text/html; charset=utf-8",
      upsert: false,
    });
    if (upErr) throw new Error(upErr.message);

    const { error: docErr } = await admin.from("documents").insert({
      kind: "generated_resume",
      storage_bucket: bucket,
      storage_path: path,
      file_name: `${data.candidate.full_name} — Résumé.html`,
      mime_type: "text/html",
      size_bytes: bytes.byteLength,
      owner_type: "candidate",
      owner_id: candidateId,
      uploaded_by: profile.id,
    });
    if (docErr) throw new Error(docErr.message);

    revalidatePath(`/dashboard/candidates/${candidateId}`);
    return { success: true };
  } catch (e) {
    console.error("generateResume failed:", e);
    return { success: false, error: "Could not generate the résumé. Please try again." };
  }
}

/**
 * Upload a document to a candidate from the dashboard. Access is checked by
 * confirming (via RLS server client) that the caller can read the candidate;
 * the file itself goes to a private bucket via the admin client.
 */
export async function uploadCandidateDocument(fd: FormData): Promise<ActionResult> {
  const profile = await requireActiveProfile();

  const candidateId = String(fd.get("candidateId") ?? "");
  const kindKey = String(fd.get("kind") ?? "");
  const fileVal = fd.get("file");

  if (!/^[0-9a-f-]{36}$/i.test(candidateId)) {
    return { success: false, error: "Invalid candidate." };
  }
  const spec = UPLOADABLE_KINDS[kindKey];
  if (!spec) return { success: false, error: "Unsupported document type." };
  if (!(fileVal instanceof File) || fileVal.size === 0) {
    return { success: false, error: "Please choose a file to upload." };
  }
  const fileErr = checkFile(fileVal, spec.rules);
  if (fileErr) return { success: false, error: fileErr };

  // RLS gate: confirm the caller can see this candidate.
  const supabase = await createClient();
  const { data: candidate } = await supabase
    .from("candidates")
    .select("id")
    .eq("id", candidateId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!candidate) return { success: false, error: "Candidate not found or not accessible." };

  const ext = fileVal.name.includes(".")
    ? fileVal.name.split(".").pop()!.toLowerCase().slice(0, 10)
    : "bin";
  const path = `${candidateId}/${crypto.randomUUID()}.${ext}`;
  const bytes = Buffer.from(await fileVal.arrayBuffer());

  const admin = createAdminClient();
  try {
    const { error: upErr } = await admin.storage.from(spec.bucket).upload(path, bytes, {
      contentType: fileVal.type || "application/octet-stream",
      upsert: false,
    });
    if (upErr) throw new Error(upErr.message);

    const { error: docErr } = await admin.from("documents").insert({
      kind: spec.kind,
      storage_bucket: spec.bucket,
      storage_path: path,
      file_name: fileVal.name,
      mime_type: fileVal.type || null,
      size_bytes: fileVal.size,
      owner_type: "candidate",
      owner_id: candidateId,
      uploaded_by: profile.id,
    });
    if (docErr) throw new Error(docErr.message);

    revalidatePath(`/dashboard/candidates/${candidateId}`);
    return { success: true };
  } catch (e) {
    console.error("uploadCandidateDocument failed:", e);
    return { success: false, error: "Upload failed. Please try again." };
  }
}

/**
 * Delete a document (storage object + metadata row). RLS on `documents` already
 * restricts deletion to admins or the original uploader; we run the delete under
 * the authenticated client so that policy is enforced, and only touch storage
 * once the row delete succeeds (proving the caller was authorized).
 */
export async function deleteDocument(documentId: string): Promise<ActionResult> {
  await requireActiveProfile();
  if (!/^[0-9a-f-]{36}$/i.test(documentId)) {
    return { success: false, error: "Invalid document." };
  }

  const supabase = await createClient();

  // Read (RLS-scoped) so we know the storage location and owner for revalidation.
  const { data: doc } = await supabase
    .from("documents")
    .select("id, storage_bucket, storage_path, owner_type, owner_id")
    .eq("id", documentId)
    .maybeSingle();
  if (!doc) return { success: false, error: "Document not found or not accessible." };

  // Attempt the metadata delete under RLS; if the caller isn't admin/uploader,
  // this deletes zero rows and we treat it as forbidden.
  const { data: deleted, error: delErr } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId)
    .select("id");
  if (delErr) return { success: false, error: delErr.message };
  if (!deleted || deleted.length === 0) {
    return { success: false, error: "You don't have permission to delete this document." };
  }

  // Row is gone → remove the underlying object (admin, since buckets are private).
  const admin = createAdminClient();
  await admin.storage.from(doc.storage_bucket).remove([doc.storage_path]);

  if (doc.owner_type === "candidate") {
    revalidatePath(`/dashboard/candidates/${doc.owner_id}`);
  }
  return { success: true };
}
