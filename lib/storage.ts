import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/database.types";

type DocumentKind = Database["public"]["Enums"]["document_kind"];
type DocumentOwnerType = Database["public"]["Enums"]["document_owner_type"];

/**
 * Upload a file to a private bucket and create its `documents` metadata row via
 * the service-role client (RLS-bypassing). Call only from trusted server code
 * that has already authorized the caller against the owner record. Returns the
 * new document id. Shared by public intake and dashboard document management.
 */
export async function uploadDocument(opts: {
  f: File;
  bucket: string;
  kind: DocumentKind;
  ownerType: DocumentOwnerType;
  ownerId: string;
  uploadedBy?: string | null;
  isConfidential?: boolean;
}): Promise<string> {
  const admin = createAdminClient();
  const ext = opts.f.name.includes(".")
    ? opts.f.name.split(".").pop()!.toLowerCase().slice(0, 10)
    : "bin";
  const path = `${opts.ownerId}/${crypto.randomUUID()}.${ext}`;
  const bytes = Buffer.from(await opts.f.arrayBuffer());

  const { error: upErr } = await admin.storage.from(opts.bucket).upload(path, bytes, {
    contentType: opts.f.type || "application/octet-stream",
    upsert: false,
  });
  if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

  const { data, error } = await admin
    .from("documents")
    .insert({
      kind: opts.kind,
      storage_bucket: opts.bucket,
      storage_path: path,
      file_name: opts.f.name,
      mime_type: opts.f.type || null,
      size_bytes: opts.f.size,
      owner_type: opts.ownerType,
      owner_id: opts.ownerId,
      uploaded_by: opts.uploadedBy ?? null,
      is_confidential: opts.isConfidential ?? false,
    })
    .select("id")
    .single();
  if (error) throw new Error(`Document record failed: ${error.message}`);
  return data.id;
}

/**
 * Create a short-lived signed URL for a private-bucket object. Called only from
 * server code, after the caller's access to the parent record has already been
 * established by RLS. Signed URLs let the browser render private files (e.g. a
 * candidate photo) without making the bucket public.
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresInSeconds = 60 * 60,
): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data) return null;
  return data.signedUrl;
}

/** Sign many objects in one bucket at once (batched). Returns path → url. */
export async function getSignedUrls(
  bucket: string,
  paths: string[],
  expiresInSeconds = 60 * 60,
): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  const admin = createAdminClient();
  const { data } = await admin.storage
    .from(bucket)
    .createSignedUrls(paths, expiresInSeconds);
  const out: Record<string, string> = {};
  for (const item of data ?? []) {
    if (item.signedUrl && item.path) out[item.path] = item.signedUrl;
  }
  return out;
}
