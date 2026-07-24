import { FileText } from "lucide-react";
import { listApplications } from "@/lib/db/applications";
import { ApplicationsBoard } from "@/components/dashboard/applications/ApplicationsBoard";

export const metadata = { title: "Applications" };

export default async function ApplicationsPage() {
  const applications = await listApplications();

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Applications
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The recruitment pipeline — move candidates through stages toward placement.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white py-16 text-center">
          <FileText className="mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">No applications yet</p>
          <p className="mt-1 max-w-md text-xs text-muted-foreground">
            Applications appear here when candidates apply to a published job on the public site, or
            when a recruiter submits a candidate to a role.
          </p>
        </div>
      ) : (
        <ApplicationsBoard applications={applications} />
      )}
    </div>
  );
}
