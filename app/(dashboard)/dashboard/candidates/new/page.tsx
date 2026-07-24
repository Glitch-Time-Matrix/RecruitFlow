import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireActiveProfile } from "@/lib/auth/session";
import { CandidateForm } from "@/components/dashboard/candidates/CandidateForm";

export const metadata = { title: "Add Candidate" };

export default async function NewCandidatePage() {
  await requireActiveProfile();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/dashboard/candidates"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to candidates
      </Link>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Add candidate</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manually register a candidate — e.g. an office walk-in. All public-form fields are available.
        </p>
      </div>
      <CandidateForm mode="create" />
    </div>
  );
}
