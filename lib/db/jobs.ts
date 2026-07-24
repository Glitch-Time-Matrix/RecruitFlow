import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/lib/database.types";
import type { Job } from "@/lib/types";

export type JobRow = Database["public"]["Tables"]["jobs"]["Row"];

/** Dashboard: all jobs the current staff user can see (published + draft). */
export async function listJobsForDashboard(): Promise<
  (JobRow & { employer_name: string | null })[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, employer:employers(company_name)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []).map((j) => {
    const { employer, ...job } = j as JobRow & { employer: { company_name: string } | null };
    return { ...job, employer_name: employer?.company_name ?? null };
  });
}

/** Map a DB job row to the public `Job` shape the marketing components expect. */
function toPublicJob(row: JobRow): Job {
  return {
    id: row.id,
    title: row.title,
    department: row.department ?? "",
    location: row.location ?? "",
    salary: row.salary_display ?? "",
    type: row.type ?? "",
    description: row.description ?? "",
    requirements: row.requirements ?? [],
  };
}

/** Public: all published jobs (stateless anon client → cacheable). */
export async function listPublishedJobs(): Promise<(Job & { slug: string })[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(200);
  return (data ?? []).map((row) => ({ ...toPublicJob(row), slug: row.slug }));
}

/** Public: one published job by slug (for /jobs/[slug]). */
export async function getPublishedJobBySlug(
  slug: string,
): Promise<(Job & { slug: string }) | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!data) return null;
  return { ...toPublicJob(data), slug: data.slug };
}

/** Public: slugs of all published jobs (for static params). */
export async function listPublishedJobSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("jobs").select("slug").eq("is_published", true).limit(500);
  return (data ?? []).map((r) => r.slug);
}
