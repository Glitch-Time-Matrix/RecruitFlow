import { listEmployers } from "@/lib/db/employers";
import { EmployerListView } from "@/components/dashboard/employers/EmployerListView";

export const metadata = { title: "Employers" };

export default async function EmployersPage() {
  const employers = await listEmployers();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Employers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Companies and their hiring requests. Sensitive contact details are shown only to
          authorized staff.
        </p>
      </div>
      <EmployerListView employers={employers} />
    </div>
  );
}
