import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Download,
  Clock,
  DollarSign,
} from "lucide-react";
import { getCandidate } from "@/lib/db/candidates";
import { CandidateStatusBadge } from "@/components/dashboard/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const DOC_LABELS: Record<string, string> = {
  resume: "Résumé",
  candidate_photo: "Profile Photo",
  generated_resume: "Generated Résumé",
  certificate: "Certificate",
  other: "Document",
};

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getCandidate(id);
  if (!candidate) notFound();

  const files = candidate.documents.filter((d) => d.kind !== "candidate_photo");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        href="/dashboard/candidates"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to candidates
      </Link>

      {/* Header */}
      <div className="flex flex-col items-start gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <Avatar className="size-24 border border-border">
          {candidate.photoUrl && (
            <AvatarImage src={candidate.photoUrl} alt={candidate.full_name} className="object-cover" />
          )}
          <AvatarFallback className="bg-primary/90 text-2xl font-semibold text-white">
            {initials(candidate.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {candidate.full_name}
            </h1>
            <CandidateStatusBadge status={candidate.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {candidate.current_title || candidate.target_role || "Candidate"}
            {candidate.current_employer ? ` · ${candidate.current_employer}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-foreground/70">
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

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-foreground">
              <GraduationCap className="size-4 text-secondary" /> Education
            </h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Highest Degree" value={candidate.highest_degree} />
              <Field label="Field of Study" value={candidate.field_of_study} />
              <Field label="University" value={candidate.university} />
              <Field label="Graduation Year" value={candidate.graduation_year} />
            </dl>
          </section>

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

          {/* Notes & activity — coming in the next iteration */}
          <section className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
            <Clock className="mx-auto mb-2 size-5 text-muted-foreground/50" />
            <p className="text-sm font-semibold text-foreground">Notes & Activity Timeline</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Recruiter notes, status history, and the activity timeline arrive in the next phase.
            </p>
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

          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-foreground">
              <FileText className="size-4 text-secondary" /> Documents
            </h2>
            {files.length === 0 ? (
              <p className="text-xs text-muted-foreground">No documents uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {files.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={doc.url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30 hover:bg-muted/40"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-xs font-semibold text-foreground">
                          {DOC_LABELS[doc.kind] ?? "Document"}
                        </p>
                        <p className="line-clamp-1 text-[11px] text-muted-foreground">{doc.file_name}</p>
                      </div>
                      <Download className="size-4 shrink-0 text-muted-foreground" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
