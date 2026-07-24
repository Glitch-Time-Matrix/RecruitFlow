import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Briefcase,
  Award,
  Pencil,
  DollarSign,
} from "lucide-react";
import { getCandidate } from "@/lib/db/candidates";
import { CandidateStatusBadge } from "@/components/dashboard/StatusBadge";
import { DocumentManager } from "@/components/dashboard/candidates/DocumentManager";
import { ExperienceEditor, EducationEditor } from "@/components/dashboard/candidates/ExperienceEditor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Candidate" };

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value?.trim() || "—"}</dd>
    </div>
  );
}

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getCandidate(id);
  if (!candidate) notFound();

  const managedDocs = candidate.documents
    .filter((d) => d.kind !== "candidate_photo")
    .map((d) => ({
      id: d.id,
      kind: d.kind,
      file_name: d.file_name,
      url: d.url,
      created_at: d.created_at,
    }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        href="/dashboard/candidates"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to candidates
      </Link>

      {/* ── Social-style profile header ── */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {/* Cover band */}
        <div className="h-28 bg-gradient-to-r from-primary via-primary/85 to-secondary sm:h-32" />
        <div className="px-6 pb-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
              {/* Large avatar overlapping the cover */}
              <Avatar className="-mt-14 size-28 border-4 border-white shadow-md sm:-mt-16 sm:size-32">
                {candidate.photoUrl && (
                  <AvatarImage src={candidate.photoUrl} alt={candidate.full_name} className="object-cover" />
                )}
                <AvatarFallback className="bg-primary/90 text-4xl font-semibold text-white">
                  {initials(candidate.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="pb-1 text-center sm:pb-2 sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {candidate.full_name}
                  </h1>
                  <CandidateStatusBadge status={candidate.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {candidate.current_title || candidate.target_role || "Candidate"}
                  {candidate.current_employer ? ` · ${candidate.current_employer}` : ""}
                </p>
              </div>
            </div>

            <div className="flex justify-center sm:justify-end">
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/candidates/${candidate.id}/edit`}>
                  <Pencil /> Edit profile
                </Link>
              </Button>
            </div>
          </div>

          {/* Contact row */}
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-foreground/70 sm:justify-start">
            {candidate.email && (
              <a href={`mailto:${candidate.email}`} className="flex items-center gap-1.5 hover:text-primary">
                <Mail className="size-3.5" /> {candidate.email}
              </a>
            )}
            {candidate.phone && (
              <a href={`tel:${candidate.phone}`} className="flex items-center gap-1.5 hover:text-primary">
                <Phone className="size-3.5" /> {candidate.phone}
              </a>
            )}
            {candidate.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" /> {candidate.location}
              </span>
            )}
            {candidate.linkedin_url && (
              <a
                href={candidate.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary"
              >
                <Linkedin className="size-3.5" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-foreground">
              <Briefcase className="size-4 text-secondary" /> Professional Details
            </h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Current Title" value={candidate.current_title} />
              <Field label="Current Employer" value={candidate.current_employer} />
              <Field label="Total Experience" value={candidate.total_experience} />
              <Field label="Notice Period" value={candidate.notice_period} />
              <Field label="Target Role" value={candidate.target_role} />
              <Field label="Preferred Industry" value={candidate.preferred_industry} />
              <Field label="Expected Salary" value={candidate.expected_salary} />
              <Field label="Work Preference" value={candidate.work_preference} />
            </dl>
          </section>

          {/* Structured experience & education (feed the résumé) */}
          <ExperienceEditor candidateId={candidate.id} experience={candidate.experience} />
          <EducationEditor candidateId={candidate.id} education={candidate.education} />

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-foreground">
              <Award className="size-4 text-secondary" /> Skills & Credentials
            </h2>
            <dl className="space-y-4">
              <Field label="Primary Skills" value={candidate.primary_skills} />
              <Field label="Secondary Skills" value={candidate.secondary_skills} />
              <Field label="Certifications" value={candidate.certifications} />
            </dl>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-display text-sm font-bold text-foreground">Snapshot</h2>
            <dl className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="size-4 text-muted-foreground" />
                <Field label="Expected Salary" value={candidate.expected_salary} />
              </div>
              <Field label="Source" value={candidate.source === "web" ? "Public website" : "Manual entry"} />
              <Field label="Consent Given" value={candidate.consent_given ? "Yes" : "No"} />
              <Field label="Registered" value={new Date(candidate.created_at).toLocaleDateString()} />
            </dl>
          </section>

          <DocumentManager candidateId={candidate.id} documents={managedDocs} />
        </div>
      </div>
    </div>
  );
}
