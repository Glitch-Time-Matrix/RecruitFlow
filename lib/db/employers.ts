import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getSignedUrl, getSignedUrls } from "@/lib/storage";
import type { Database } from "@/lib/database.types";

export type EmployerRow = Database["public"]["Tables"]["employers"]["Row"];
export type EmployerContact = Database["public"]["Tables"]["employer_contacts"]["Row"];
export type HiringRequestRow = Database["public"]["Tables"]["hiring_requests"]["Row"];
export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];

export type EmployerListItem = EmployerRow & {
  logoUrl: string | null;
  requestCount: number;
};

export type EmployerDetail = EmployerRow & {
  logoUrl: string | null;
  /**
   * Sensitive contacts. `canViewContacts` distinguishes "restricted" (recruiter
   * without the employer_contacts grant) from "none on file". When restricted,
   * `contacts` is empty because RLS returned no rows.
   */
  canViewContacts: boolean;
  contacts: EmployerContact[];
  hiringRequests: HiringRequestRow[];
  documents: (DocumentRow & { url: string | null })[];
};

type LogoJoin = { storage_bucket: string; storage_path: string } | null;

/** Whether the current user may see employer contact details (admin or granted). */
async function canViewEmployerContacts(): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("has_permission", { p_area: "employer_contacts" });
  return Boolean(data);
}

/** Employers the current user can see (RLS-scoped), with logos + request counts. */
export async function listEmployers(): Promise<EmployerListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employers")
    .select(
      "*, logo:documents!employers_logo_document_id_fkey(storage_bucket, storage_path), hiring_requests(count)",
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as (EmployerRow & {
    logo: LogoJoin;
    hiring_requests: { count: number }[];
  })[];

  const logoPaths = rows
    .map((r) => r.logo?.storage_path)
    .filter((p): p is string => Boolean(p));
  const signed = await getSignedUrls("employer-logos", logoPaths);

  return rows.map((r) => {
    const { logo, hiring_requests, ...employer } = r;
    return {
      ...employer,
      logoUrl: logo?.storage_path ? signed[logo.storage_path] ?? null : null,
      requestCount: hiring_requests?.[0]?.count ?? 0,
    };
  });
}

export async function getEmployer(id: string): Promise<EmployerDetail | null> {
  const supabase = await createClient();

  const { data: employer } = await supabase
    .from("employers")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!employer) return null;

  const [canViewContacts, contactsRes, requestsRes, docsRes] = await Promise.all([
    canViewEmployerContacts(),
    supabase.from("employer_contacts").select("*").eq("employer_id", id),
    supabase
      .from("hiring_requests")
      .select("*")
      .eq("employer_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("documents")
      .select("*")
      .eq("owner_type", "employer")
      .eq("owner_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const documents = docsRes.data ?? [];
  const withUrls = await Promise.all(
    documents.map(async (d) => ({
      ...d,
      url: await getSignedUrl(d.storage_bucket, d.storage_path),
    })),
  );

  const logoDoc = documents.find((d) => d.id === employer.logo_document_id);
  const logoUrl = logoDoc ? withUrls.find((d) => d.id === logoDoc.id)?.url ?? null : null;

  return {
    ...employer,
    logoUrl,
    canViewContacts,
    contacts: contactsRes.data ?? [],
    hiringRequests: requestsRes.data ?? [],
    documents: withUrls,
  };
}
