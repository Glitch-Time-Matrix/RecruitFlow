import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getSignedUrl } from "@/lib/storage";
import type { Database } from "@/lib/database.types";

export type HiringRequestRow = Database["public"]["Tables"]["hiring_requests"]["Row"];

export type HiringRequestListItem = HiringRequestRow & { employer_name: string | null };

export type HiringRequestDetail = HiringRequestRow & {
  employer_name: string | null;
  jdUrl: string | null;
  /** Slug of the published job created from this request, if any. */
  publishedJobSlug: string | null;
};

export async function listHiringRequests(): Promise<HiringRequestListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hiring_requests")
    .select("*, employer:employers(company_name)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => {
    const { employer, ...req } = r as HiringRequestRow & { employer: { company_name: string } | null };
    return { ...req, employer_name: employer?.company_name ?? null };
  });
}

export async function getHiringRequest(id: string): Promise<HiringRequestDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hiring_requests")
    .select("*, employer:employers(company_name)")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;

  const { employer, ...req } = data as HiringRequestRow & { employer: { company_name: string } | null };

  let jdUrl: string | null = null;
  if (req.jd_document_id) {
    const { data: doc } = await supabase
      .from("documents")
      .select("storage_bucket, storage_path")
      .eq("id", req.jd_document_id)
      .maybeSingle();
    if (doc) jdUrl = await getSignedUrl(doc.storage_bucket, doc.storage_path);
  }

  const { data: job } = await supabase
    .from("jobs")
    .select("slug")
    .eq("hiring_request_id", id)
    .maybeSingle();

  return {
    ...req,
    employer_name: employer?.company_name ?? null,
    jdUrl,
    publishedJobSlug: job?.slug ?? null,
  };
}
