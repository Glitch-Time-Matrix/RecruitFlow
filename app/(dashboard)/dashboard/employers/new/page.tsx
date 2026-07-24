import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireActiveProfile } from "@/lib/auth/session";
import { EmployerForm } from "@/components/dashboard/employers/EmployerForm";

export const metadata = { title: "Add Employer" };

export default async function NewEmployerPage() {
  await requireActiveProfile();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/dashboard/employers"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to employers
      </Link>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Add employer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manually register a company and its primary contact — e.g. a direct client engagement.
        </p>
      </div>
      <EmployerForm mode="create" />
    </div>
  );
}
