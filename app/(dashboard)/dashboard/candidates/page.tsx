import { listCandidates, listCandidateIndustries } from "@/lib/db/candidates";
import { CandidateListView } from "@/components/dashboard/candidates/CandidateListView";

export const metadata = { title: "Candidates" };

export default async function CandidatesPage() {
  const [candidates, industries] = await Promise.all([
    listCandidates(),
    listCandidateIndustries(),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Candidates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your talent pool — switch between photo cards and the detailed table.
        </p>
      </div>

      <CandidateListView candidates={candidates} industries={industries} />
    </div>
  );
}
