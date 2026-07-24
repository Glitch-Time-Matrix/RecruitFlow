import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getSignedUrls } from "@/lib/storage";
import type { Database } from "@/lib/database.types";

export type ApplicationStage = Database["public"]["Enums"]["application_stage"];

export type ApplicationCard = {
  id: string;
  stage: ApplicationStage;
  createdAt: string;
  candidateId: string;
  candidateName: string;
  candidatePhotoUrl: string | null;
  jobTitle: string | null;
  employerName: string | null;
};

type Joined = {
  id: string;
  stage: ApplicationStage;
  created_at: string;
  candidate: {
    id: string;
    full_name: string;
    photo: { storage_path: string } | null;
  } | null;
  job: { title: string } | null;
  employer: { company_name: string } | null;
};

/** All applications the current user can see (RLS-scoped), shaped for the board. */
export async function listApplications(): Promise<ApplicationCard[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(
      "id, stage, created_at, " +
        "candidate:candidates(id, full_name, photo:documents!candidates_photo_document_id_fkey(storage_path)), " +
        "job:jobs(title), employer:employers(company_name)",
    )
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as unknown as Joined[];

  const photoPaths = rows
    .map((r) => r.candidate?.photo?.storage_path)
    .filter((p): p is string => Boolean(p));
  const signed = await getSignedUrls("candidate-photos", photoPaths);

  return rows.map((r) => ({
    id: r.id,
    stage: r.stage,
    createdAt: r.created_at,
    candidateId: r.candidate?.id ?? "",
    candidateName: r.candidate?.full_name ?? "Unknown candidate",
    candidatePhotoUrl: r.candidate?.photo?.storage_path
      ? signed[r.candidate.photo.storage_path] ?? null
      : null,
    jobTitle: r.job?.title ?? null,
    employerName: r.employer?.company_name ?? null,
  }));
}
