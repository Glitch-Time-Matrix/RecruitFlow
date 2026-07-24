import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Globe,
  Users2,
  Lock,
  Mail,
  Phone,
  ClipboardList,
  FileText,
  Download,
  Clock,
  ShieldCheck,
  Pencil,
} from "lucide-react";
import { getEmployer } from "@/lib/db/employers";
import { EmployerStatusBadge, HiringStatusBadge } from "@/components/dashboard/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Employer" };

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

export default async function EmployerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employer = await getEmployer(id);
  if (!employer) notFound();

  const files = employer.documents.filter((d) => d.kind !== "employer_logo");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        href="/dashboard/employers"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to employers
      </Link>

      {/* Header */}
      <div className="flex flex-col items-start gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <Avatar className="size-20 rounded-2xl border border-border">
          {employer.logoUrl && (
            <AvatarImage src={employer.logoUrl} alt={employer.company_name} className="object-contain" />
          )}
          <AvatarFallback className="rounded-2xl bg-secondary/10 text-xl font-semibold text-secondary">
            {initials(employer.company_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                {employer.company_name}
              </h1>
              <EmployerStatusBadge status={employer.status} />
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/employers/${employer.id}/edit`}>
                <Pencil /> Edit
              </Link>
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-foreground/70">
            {employer.industry && (
              <span className="flex items-center gap-1.5">
                <Building2 className="size-3.5" /> {employer.industry}
              </span>
            )}
            {employer.company_scale && (
              <span className="flex items-center gap-1.5">
                <Users2 className="size-3.5" /> {employer.company_scale}
              </span>
            )}
            {employer.website_url && (
              <a
                href={employer.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary"
              >
                <Globe className="size-3.5" /> Website
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Hiring requests */}
          <section className="rounded-2xl border border-border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <ClipboardList className="size-4 text-secondary" />
              <h2 className="font-display text-sm font-bold text-foreground">
                Hiring Requests ({employer.hiringRequests.length})
              </h2>
            </div>
            {employer.hiringRequests.length === 0 ? (
              <p className="px-6 py-8 text-center text-xs text-muted-foreground">
                No hiring requests from this employer yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {employer.hiringRequests.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold text-foreground">{r.job_title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[r.department, r.employment_type, r.work_location].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <HiringStatusBadge status={r.status} />
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Notes & activity placeholder */}
          <section className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
            <Clock className="mx-auto mb-2 size-5 text-muted-foreground/50" />
            <p className="text-sm font-semibold text-foreground">Notes & Activity Timeline</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Private notes and recruitment history arrive in a later phase.
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SENSITIVE: contacts — gated by permission */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                <Users2 className="size-4 text-secondary" /> Contact Details
              </h2>
              <ShieldCheck className="size-4 text-accent" />
            </div>

            {!employer.canViewContacts ? (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center">
                <Lock className="mb-2 size-6 text-muted-foreground/50" />
                <p className="text-xs font-semibold text-foreground">Restricted</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  You don&apos;t have permission to view this employer&apos;s contact details. Ask a
                  super admin to grant access.
                </p>
              </div>
            ) : employer.contacts.length === 0 ? (
              <p className="text-xs text-muted-foreground">No contacts on file.</p>
            ) : (
              <ul className="space-y-4">
                {employer.contacts.map((c) => (
                  <li key={c.id} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{c.contact_name || "—"}</p>
                      {c.is_primary && (
                        <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-accent">
                          Primary
                        </span>
                      )}
                    </div>
                    {c.designation && (
                      <p className="text-xs text-muted-foreground">{c.designation}</p>
                    )}
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-xs text-foreground/80 hover:text-primary">
                        <Mail className="size-3.5" /> {c.email}
                      </a>
                    )}
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-xs text-foreground/80 hover:text-primary">
                        <Phone className="size-3.5" /> {c.phone}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Documents */}
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
                          {doc.kind === "job_description" ? "Job Description" : "Document"}
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

          {/* Snapshot */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-display text-sm font-bold text-foreground">Snapshot</h2>
            <dl className="space-y-3">
              <Field label="Source" value={employer.source === "web" ? "Public website" : "Manual entry"} />
              <Field label="Added" value={new Date(employer.created_at).toLocaleDateString()} />
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
