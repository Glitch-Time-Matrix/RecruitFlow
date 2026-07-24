import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { listHiringRequests } from "@/lib/db/hiring-requests";
import { HiringStatusBadge } from "@/components/dashboard/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = { title: "Hiring Requests" };

export default async function HiringRequestsPage() {
  const requests = await listHiringRequests();
  const pending = requests.filter((r) => r.status === "new" || r.status === "under_review").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Hiring Requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review employer submissions and publish approved roles to the public site.
          {pending > 0 && (
            <span className="ml-1 font-semibold text-amber-600">{pending} awaiting review.</span>
          )}
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white py-16 text-center">
          <ClipboardList className="mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">No hiring requests yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Requests appear here when employers submit the hiring form.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Role</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link href={`/dashboard/hiring-requests/${r.id}`} className="block">
                      <p className="line-clamp-1 text-sm font-semibold text-foreground hover:text-primary">
                        {r.job_title}
                      </p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {[r.department, r.employment_type].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-foreground/70">{r.employer_name || "—"}</TableCell>
                  <TableCell className="text-xs text-foreground/70">{r.urgency_timeline || "—"}</TableCell>
                  <TableCell>
                    <HiringStatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
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
