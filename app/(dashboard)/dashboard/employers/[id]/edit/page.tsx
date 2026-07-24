import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getEmployer } from "@/lib/db/employers";
import { EmployerForm } from "@/components/dashboard/employers/EmployerForm";

export const metadata = { title: "Edit Employer" };

export default async function EditEmployerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employer = await getEmployer(id);
  if (!employer) notFound();

  const primaryContact =
    employer.contacts.find((c) => c.is_primary) ?? employer.contacts[0] ?? null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href={`/dashboard/employers/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to employer
      </Link>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Edit {employer.company_name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Update this company&apos;s details.</p>
      </div>
      <EmployerForm
        mode="edit"
        employer={employer}
        contact={primaryContact}
        canEditContacts={employer.canViewContacts}
      />
    </div>
  );
}
