import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getSignedUrl, getSignedUrls } from "@/lib/storage";
import type { Database } from "@/lib/database.types";

export type CandidateRow = Database["public"]["Tables"]["candidates"]["Row"];
export type CandidateStatus = Database["public"]["Enums"]["candidate_status"];
export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];

/** A candidate plus a ready-to-render (signed) photo URL, if any. */
export type CandidateListItem = CandidateRow & { photoUrl: string | null };

export type CandidateDetail = CandidateRow & {
  photoUrl: string | null;
  documents: (DocumentRow & { url: string | null })[];
};

export type CandidateListParams = {
  search?: string;
  status?: CandidateStatus | "all";
  industry?: string | "all";
};

type PhotoJoin = { storage_bucket: string; storage_path: string } | null;

/**
 * List candidates the current user is allowed to see (RLS-scoped via the
 * authenticated server client), with signed photo URLs resolved in one batch.
 */
export async function listCandidates(
  params: CandidateListParams = {},
): Promise<CandidateListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("candidates")
    .select("*, photo:documents!candidates_photo_document_id_fkey(storage_bucket, storage_path)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);

  if (params.status && params.status !== "all") query = query.eq("status", params.status);
  if (params.industry && params.industry !== "all") {
    query = query.eq("preferred_industry", params.industry);
  }
  if (params.search && params.search.trim()) {
    const term = params.search.trim();
    // Full-text search over the generated tsvector, with a name fallback.
    query = query.or(
      `full_name.ilike.%${term}%,current_title.ilike.%${term}%,primary_skills.ilike.%${term}%,target_role.ilike.%${term}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as (CandidateRow & { photo: PhotoJoin })[];

  // Batch-sign photo URLs (all photos live in the candidate-photos bucket).
  const photoPaths = rows
    .map((r) => r.photo?.storage_path)
    .filter((p): p is string => Boolean(p));
  const signed = await getSignedUrls("candidate-photos", photoPaths);

  return rows.map((r) => {
    const { photo, ...candidate } = r;
    return {
      ...candidate,
      photoUrl: photo?.storage_path ? signed[photo.storage_path] ?? null : null,
    };
  });
}

/**
 * Fetch one candidate (RLS-scoped) with its documents, all photo/file URLs
 * signed for rendering. Returns null if not found or not accessible.
 */
export async function getCandidate(id: string): Promise<CandidateDetail | null> {
  const supabase = await createClient();

  const { data: candidate } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!candidate) return null;

  const { data: docs } = await supabase
    .from("documents")
    .select("*")
    .eq("owner_type", "candidate")
    .eq("owner_id", id)
    .order("created_at", { ascending: false });

  const documents = docs ?? [];

  // Sign every document URL (grouped by bucket) + the linked photo.
  const withUrls = await Promise.all(
    documents.map(async (d) => ({
      ...d,
      url: await getSignedUrl(d.storage_bucket, d.storage_path),
    })),
  );

  const photoDoc = documents.find((d) => d.id === candidate.photo_document_id);
  const photoUrl = photoDoc
    ? withUrls.find((d) => d.id === photoDoc.id)?.url ?? null
    : null;

  return { ...candidate, photoUrl, documents: withUrls };
}

/**
 * Fetch everything needed to render a candidate's generated résumé: the core
 * record plus any structured experience/education rows (RLS-scoped). Returns
 * null if the candidate isn't found or accessible.
 */
export async function getResumeData(id: string): Promise<{
  candidate: CandidateRow;
  experience: Database["public"]["Tables"]["candidate_experience"]["Row"][];
  education: Database["public"]["Tables"]["candidate_education"]["Row"][];
} | null> {
  const supabase = await createClient();

  const { data: candidate } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!candidate) return null;

  const [{ data: experience }, { data: education }] = await Promise.all([
    supabase
      .from("candidate_experience")
      .select("*")
      .eq("candidate_id", id)
      .order("is_current", { ascending: false })
      .order("start_date", { ascending: false, nullsFirst: false }),
    supabase
      .from("candidate_education")
      .select("*")
      .eq("candidate_id", id)
      .order("graduation_year", { ascending: false, nullsFirst: false }),
  ]);

  return {
    candidate,
    experience: experience ?? [],
    education: education ?? [],
  };
}

/** Distinct preferred industries present in the accessible candidate set (for filters). */
export async function listCandidateIndustries(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("candidates")
    .select("preferred_industry")
    .is("deleted_at", null)
    .not("preferred_industry", "is", null)
    .limit(500);
  const set = new Set<string>();
  for (const row of data ?? []) {
    if (row.preferred_industry) set.add(row.preferred_industry);
  }
  return Array.from(set).sort();
}
