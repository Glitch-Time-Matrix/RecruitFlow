"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, Building2 } from "lucide-react";
import type { EmployerRow, EmployerContact } from "@/lib/db/employers";
import { createEmployer, updateEmployer } from "@/lib/actions/employers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Mode = "create" | "edit";

const STATUSES = [
  { value: "prospect", label: "Prospect" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function F({ id, label, children, required, full }: {
  id: string; label: string; children: React.ReactNode; required?: boolean; full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <Label htmlFor={id} className="mb-1.5 text-xs">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-display text-sm font-bold text-foreground">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function EmployerForm({
  mode,
  employer,
  contact,
  canEditContacts = true,
}: {
  mode: Mode;
  employer?: EmployerRow;
  contact?: EmployerContact | null;
  canEditContacts?: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<string>(employer?.status ?? "prospect");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("status", status);
    if (mode === "edit" && employer) fd.set("id", employer.id);

    start(async () => {
      const res = mode === "create" ? await createEmployer(fd) : await updateEmployer(fd);
      if (res.success) {
        toast.success(mode === "create" ? "Employer created." : "Employer updated.");
        router.push(`/dashboard/employers/${res.id}`);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Section title="Company">
        <F id="companyName" label="Company name" required>
          <Input id="companyName" name="companyName" defaultValue={employer?.company_name ?? ""} required />
        </F>
        <F id="industry" label="Industry">
          <Input id="industry" name="industry" defaultValue={employer?.industry ?? ""} />
        </F>
        <F id="companyScale" label="Company scale">
          <Input id="companyScale" name="companyScale" defaultValue={employer?.company_scale ?? ""} placeholder="e.g. 500-1000 employees" />
        </F>
        <F id="websiteUrl" label="Website URL">
          <Input id="websiteUrl" name="websiteUrl" defaultValue={employer?.website_url ?? ""} />
        </F>
        <F id="status" label="Status">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </F>
        <F id="logo" label={mode === "edit" ? "Replace logo" : "Company logo"}>
          <Input id="logo" name="logo" type="file" accept="image/jpeg,image/png,image/webp" />
        </F>
      </Section>

      {canEditContacts ? (
        <Section title="Primary Contact">
          <F id="contactName" label="Contact name">
            <Input id="contactName" name="contactName" defaultValue={contact?.contact_name ?? ""} />
          </F>
          <F id="designation" label="Designation">
            <Input id="designation" name="designation" defaultValue={contact?.designation ?? ""} />
          </F>
          <F id="contactEmail" label="Email">
            <Input id="contactEmail" name="contactEmail" type="email" defaultValue={contact?.email ?? ""} />
          </F>
          <F id="contactPhone" label="Phone">
            <Input id="contactPhone" name="contactPhone" defaultValue={contact?.phone ?? ""} />
          </F>
        </Section>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center text-xs text-muted-foreground">
          You don&apos;t have permission to edit contact details. Company fields above will still save.
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : mode === "create" ? <Building2 /> : <Save />}
          {mode === "create" ? "Create employer" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
