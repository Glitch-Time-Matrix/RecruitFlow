"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, UserPlus } from "lucide-react";
import type { CandidateRow } from "@/lib/db/candidates";
import { createCandidate, updateCandidate } from "@/lib/actions/candidates";
import { CANDIDATE_STATUSES } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Mode = "create" | "edit";

function F({
  id,
  label,
  children,
  required,
  full,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  required?: boolean;
  full?: boolean;
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

export function CandidateForm({
  mode,
  candidate,
}: {
  mode: Mode;
  candidate?: CandidateRow;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<string>(candidate?.status ?? "new");

  const v = (key: keyof CandidateRow) => (candidate?.[key] as string | null) ?? "";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("status", status);
    if (mode === "edit" && candidate) fd.set("id", candidate.id);

    start(async () => {
      const res = mode === "create" ? await createCandidate(fd) : await updateCandidate(fd);
      if (res.success) {
        toast.success(mode === "create" ? "Candidate created." : "Candidate updated.");
        router.push(`/dashboard/candidates/${res.id}`);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Section title="Personal">
        <F id="fullName" label="Full name" required>
          <Input id="fullName" name="fullName" defaultValue={v("full_name")} required />
        </F>
        <F id="email" label="Email" required>
          <Input id="email" name="email" type="email" defaultValue={v("email")} required />
        </F>
        <F id="phone" label="Phone" required>
          <Input id="phone" name="phone" defaultValue={v("phone")} required />
        </F>
        <F id="location" label="Location">
          <Input id="location" name="location" defaultValue={v("location")} />
        </F>
        <F id="linkedInUrl" label="LinkedIn URL" full>
          <Input id="linkedInUrl" name="linkedInUrl" defaultValue={v("linkedin_url")} />
        </F>
      </Section>

      <Section title="Professional">
        <F id="currentTitle" label="Current title">
          <Input id="currentTitle" name="currentTitle" defaultValue={v("current_title")} />
        </F>
        <F id="currentEmployer" label="Current employer">
          <Input id="currentEmployer" name="currentEmployer" defaultValue={v("current_employer")} />
        </F>
        <F id="totalExperience" label="Total experience">
          <Input id="totalExperience" name="totalExperience" defaultValue={v("total_experience")} placeholder="e.g. 3-5 years" />
        </F>
        <F id="noticePeriod" label="Notice period">
          <Input id="noticePeriod" name="noticePeriod" defaultValue={v("notice_period")} placeholder="e.g. 30 Days" />
        </F>
        <F id="targetRole" label="Target role">
          <Input id="targetRole" name="targetRole" defaultValue={v("target_role")} />
        </F>
        <F id="preferredIndustry" label="Preferred industry">
          <Input id="preferredIndustry" name="preferredIndustry" defaultValue={v("preferred_industry")} />
        </F>
        <F id="expectedSalary" label="Expected salary">
          <Input id="expectedSalary" name="expectedSalary" defaultValue={v("expected_salary")} />
        </F>
        <F id="workPreference" label="Work preference">
          <Input id="workPreference" name="workPreference" defaultValue={v("work_preference")} placeholder="e.g. Remote / Hybrid" />
        </F>
      </Section>

      <Section title="Education">
        <F id="highestDegree" label="Highest degree">
          <Input id="highestDegree" name="highestDegree" defaultValue={v("highest_degree")} />
        </F>
        <F id="fieldOfStudy" label="Field of study">
          <Input id="fieldOfStudy" name="fieldOfStudy" defaultValue={v("field_of_study")} />
        </F>
        <F id="university" label="University">
          <Input id="university" name="university" defaultValue={v("university")} />
        </F>
        <F id="graduationYear" label="Graduation year">
          <Input id="graduationYear" name="graduationYear" defaultValue={v("graduation_year")} />
        </F>
      </Section>

      <Section title="Résumé & Summary">
        <F id="professionalSummary" label="Professional summary" full>
          <Textarea
            id="professionalSummary"
            name="professionalSummary"
            defaultValue={v("professional_summary")}
            rows={4}
            placeholder="2-4 sentence pitch — headline achievements and value. Shown at the top of the generated résumé. Leave blank to auto-generate from the profile."
          />
        </F>
      </Section>

      <Section title="Skills & Credentials">
        <F id="primarySkills" label="Primary skills" required full>
          <Textarea id="primarySkills" name="primarySkills" defaultValue={v("primary_skills")} required rows={2} placeholder="Comma-separated" />
        </F>
        <F id="secondarySkills" label="Secondary skills" full>
          <Textarea id="secondarySkills" name="secondarySkills" defaultValue={v("secondary_skills")} rows={2} placeholder="Comma-separated" />
        </F>
        <F id="certifications" label="Certifications" full>
          <Textarea id="certifications" name="certifications" defaultValue={v("certifications")} rows={2} placeholder="Comma-separated" />
        </F>
      </Section>

      <Section title="Pipeline & Files">
        <F id="status" label="Status">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CANDIDATE_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </F>
        <div />
        <F id="photo" label={mode === "edit" ? "Replace profile photo" : "Profile photo"}>
          <Input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" />
        </F>
        {mode === "create" && (
          <F id="resume" label="Résumé (PDF/Word)">
            <Input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
          </F>
        )}
      </Section>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : mode === "create" ? <UserPlus /> : <Save />}
          {mode === "create" ? "Create candidate" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
