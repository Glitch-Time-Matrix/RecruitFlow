import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Download, Building2, Globe } from "lucide-react";
import { getHiringRequest } from "@/lib/db/hiring-requests";
import { requireActiveProfile, isAdminRole } from "@/lib/auth/session";
import { HiringStatusBadge } from "@/components/dashboard/StatusBadge";
import { ReviewActions } from "@/components/dashboard/hiring-requests/ReviewActions";
import {
  PublishJobForm,
  PublishedNotice,
} from "@/components/dashboard/hiring-requests/PublishJobForm";

export const metadata = { title: "Hiring Request" };

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value?.trim() || "—"}</dd>
    </div>
  );
}

export default async function HiringRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [request, profile] = await Promise.all([getHiringRequest(id), requireActiveProfile()]);
  if (!request) notFound();

  const canPublish = isAdminRole(profile.role);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/dashboard/hiring-requests"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to hiring requests
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                {request.job_title}
              </h1>
              <HiringStatusBadge status={request.status} />
            </div>
            {request.employer_name && (
              <Link
                href={`/dashboard/employers`}
                className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
              >
                <Building2 className="size-3.5" /> {request.employer_name}
              </Link>
            )}
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <ReviewActions id={request.id} status={request.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Request details */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-display text-sm font-bold text-foreground">Requirement Details</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Department" value={request.department} />
              <Field label="Employment Type" value={request.employment_type} />
              <Field label="Openings" value={request.openings_count} />
              <Field label="Experience Required" value={request.required_experience} />
              <Field label="Work Location" value={request.work_location} />
              <Field label="Salary Range" value={request.salary_range} />
              <Field label="Timeline" value={request.urgency_timeline} />
            </dl>
            <div className="mt-4 space-y-4 border-t border-border pt-4">
              <Field label="Required Skills" value={request.required_skills} />
              <Field label="Job Description" value={request.job_description_text} />
              {request.additional_notes && <Field label="Additional Notes" value={request.additional_notes} />}
            </div>
            {request.jdUrl && (
              <a
                href={request.jdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:border-primary/30 hover:bg-muted/40"
              >
                <FileText className="size-4 text-primary" /> Job Description Document
                <Download className="size-3.5 text-muted-foreground" />
              </a>
            )}
          </section>
        </div>

        {/* Publish panel */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-foreground">
              <Globe className="size-4 text-accent" /> Publish to Public Site
            </h2>

            {request.publishedJobSlug ? (
              <PublishedNotice slug={request.publishedJobSlug} />
            ) : !canPublish ? (
              <p className="text-xs text-muted-foreground">
                Only admins can publish jobs to the public site.
              </p>
            ) : request.status === "approved" ? (
              <PublishJobForm
                defaults={{
                  requestId: request.id,
                  title: request.job_title,
                  department: request.department ?? "",
                  location: request.work_location ?? "",
                  salary_display: request.salary_range ?? "",
                  type: request.employment_type ?? "",
                  description: request.job_description_text ?? "",
                  requirements: (request.required_skills ?? "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .join("\n"),
                }}
              />
            ) : (
              <p className="text-xs text-muted-foreground">
                Approve this request first to publish it as a public job.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
