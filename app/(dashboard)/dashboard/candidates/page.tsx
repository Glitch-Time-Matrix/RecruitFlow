import Link from "next/link";
import { UserPlus } from "lucide-react";
import { listCandidates, listCandidateIndustries } from "@/lib/db/candidates";
import { CandidateListView } from "@/components/dashboard/candidates/CandidateListView";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Candidates" };

export default async function CandidatesPage() {
  const [candidates, industries] = await Promise.all([
    listCandidates(),
    listCandidateIndustries(),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Candidates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your talent pool — switch between photo cards and the detailed table.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/candidates/new">
            <UserPlus /> Add candidate
          </Link>
        </Button>
      </div>

      <CandidateListView candidates={candidates} industries={industries} />
    </div>
  );
}
