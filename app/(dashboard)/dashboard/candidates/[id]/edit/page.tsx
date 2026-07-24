import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCandidate } from "@/lib/db/candidates";
import { CandidateForm } from "@/components/dashboard/candidates/CandidateForm";

export const metadata = { title: "Edit Candidate" };

export default async function EditCandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getCandidate(id);
  if (!candidate) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href={`/dashboard/candidates/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to profile
      </Link>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Edit {candidate.full_name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update this candidate&apos;s profile. Experience &amp; education are managed on the profile page.
        </p>
      </div>
      <CandidateForm mode="edit" candidate={candidate} />
    </div>
  );
}
