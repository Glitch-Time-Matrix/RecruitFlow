import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

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
