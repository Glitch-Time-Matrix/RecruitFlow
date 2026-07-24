import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, DollarSign, Briefcase, CheckCircle2, ArrowUpRight } from "lucide-react";
import { getPublishedJobBySlug, listPublishedJobSlugs } from "@/lib/db/jobs";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await listPublishedJobSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) return { title: "Job Not Found" };
  return {
    title: job.title,
    description: job.description?.slice(0, 155) || `${job.title} — apply via our agency.`,
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) notFound();

  return (
    <div className="min-h-screen w-full bg-background pb-24 pt-24 text-left">
      <div className="mx-auto max-w-4xl px-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/60 hover:text-primary"
        >
          <ArrowLeft className="size-3.5" /> All open positions
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {job.department && (
            <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
              {job.department}
            </span>
          )}
          {job.type && (
            <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
              {job.type}
            </span>
          )}
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {job.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-foreground/60">
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-foreground/50" /> {job.location}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1.5">
              <DollarSign className="size-3.5 text-foreground/50" /> {job.salary}
            </span>
          )}
        </div>

        {job.description && (
          <div className="mt-8">
            <h2 className="mb-2 font-display text-lg font-bold text-foreground">About the Role</h2>
            <p className="whitespace-pre-line text-sm font-light leading-relaxed text-foreground/70">
              {job.description}
            </p>
          </div>
        )}

        {job.requirements.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 font-display text-lg font-bold text-foreground">Requirements</h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-light text-foreground/80">
                  <span className="mt-0.5 shrink-0 rounded-full bg-accent/15 p-0.5 text-accent">
                    <CheckCircle2 className="size-3.5" />
                  </span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Apply CTA */}
        <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-border bg-muted/40 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Interested in this role?</h3>
            <p className="mt-1 text-sm font-light text-foreground/70">
              Submit your profile confidentially and our recruiters will be in touch.
            </p>
          </div>
          <Link
            href={`/candidates?role=${encodeURIComponent(job.title)}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
          >
            Apply Now <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
