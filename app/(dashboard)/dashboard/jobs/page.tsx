import { Briefcase, ExternalLink } from "lucide-react";
import { listJobsForDashboard } from "@/lib/db/jobs";
import { requireActiveProfile, isAdminRole } from "@/lib/auth/session";
import { JobPublishToggle } from "@/components/dashboard/jobs/JobPublishToggle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = { title: "Jobs" };

export default async function JobsPage() {
  const [jobs, profile] = await Promise.all([listJobsForDashboard(), requireActiveProfile()]);
  const canManage = isAdminRole(profile.role);
  const published = jobs.filter((j) => j.is_published).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Jobs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Published listings appear on the public site. {published} of {jobs.length} live.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white py-16 text-center">
          <Briefcase className="mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">No jobs yet</p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Publish an approved hiring request to create your first public job listing.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Job</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((j) => (
                <TableRow key={j.id}>
                  <TableCell>
                    <p className="line-clamp-1 text-sm font-semibold text-foreground">{j.title}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {[j.department, j.type].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs text-foreground/70">{j.location || "—"}</TableCell>
                  <TableCell>
                    {j.is_published ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-800">
                        <span className="size-1.5 rounded-full bg-green-600" /> Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                        <span className="size-1.5 rounded-full bg-slate-400" /> Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {j.published_at ? new Date(j.published_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {j.is_published && (
                        <a
                          href={`/jobs/${j.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                        >
                          View <ExternalLink className="size-3" />
                        </a>
                      )}
                      {canManage && <JobPublishToggle jobId={j.id} isPublished={j.is_published} />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
