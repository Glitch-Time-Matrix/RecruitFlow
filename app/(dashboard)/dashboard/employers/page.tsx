import Link from "next/link";
import { Building2 } from "lucide-react";
import { listEmployers } from "@/lib/db/employers";
import { EmployerListView } from "@/components/dashboard/employers/EmployerListView";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Employers" };

export default async function EmployersPage() {
  const employers = await listEmployers();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Employers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Companies and their hiring requests. Sensitive contact details are shown only to
            authorized staff.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/employers/new">
            <Building2 /> Add employer
          </Link>
        </Button>
      </div>
      <EmployerListView employers={employers} />
    </div>
  );
}
