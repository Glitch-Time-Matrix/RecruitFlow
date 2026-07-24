"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Briefcase, GraduationCap, Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";
import {
  saveExperience,
  deleteExperience,
  saveEducation,
  deleteEducation,
} from "@/lib/actions/candidates";
import type { Database } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type Experience = Database["public"]["Tables"]["candidate_experience"]["Row"];
type Education = Database["public"]["Tables"]["candidate_education"]["Row"];

function fmtRange(start: string | null, end: string | null, current: boolean): string {
  const f = (d: string | null) => {
    if (!d) return "";
    const dt = new Date(d + "T00:00:00");
    return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  const from = f(start);
  const to = current ? "Present" : f(end);
  return [from, to].filter(Boolean).join(" – ") || "—";
}

// ── Experience ──────────────────────────────────────────────────────────────

function ExperienceRow({
  candidateId,
  entry,
  onDone,
}: {
  candidateId: string;
  entry?: Experience;
  onDone: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [isCurrent, setIsCurrent] = useState(entry?.is_current ?? false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("candidateId", candidateId);
    if (entry) fd.set("entryId", entry.id);
    fd.set("isCurrent", isCurrent ? "true" : "");
    start(async () => {
      const res = await saveExperience(fd);
      if (res.success) {
        toast.success("Experience saved.");
        router.refresh();
        onDone();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-primary/30 bg-muted/30 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label className="mb-1 text-xs">Title</Label>
          <Input name="title" defaultValue={entry?.title ?? ""} placeholder="Senior Engineer" />
        </div>
        <div>
          <Label className="mb-1 text-xs">Company</Label>
          <Input name="company" defaultValue={entry?.company ?? ""} placeholder="Acme Corp" />
        </div>
        <div>
          <Label className="mb-1 text-xs">Start date</Label>
          <Input name="startDate" type="date" defaultValue={entry?.start_date ?? ""} />
        </div>
        <div>
          <Label className="mb-1 text-xs">End date</Label>
          <Input name="endDate" type="date" defaultValue={entry?.end_date ?? ""} disabled={isCurrent} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs text-foreground">
        <Checkbox checked={isCurrent} onCheckedChange={(c) => setIsCurrent(c === true)} />
        I currently work here
      </label>
      <div>
        <Label className="mb-1 text-xs">Description / achievements</Label>
        <Textarea name="description" defaultValue={entry?.description ?? ""} rows={3} placeholder="Key responsibilities and measurable achievements…" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone} disabled={pending}>
          <X /> Cancel
        </Button>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Check />} Save
        </Button>
      </div>
    </form>
  );
}

export function ExperienceEditor({
  candidateId,
  experience,
}: {
  candidateId: string;
  experience: Experience[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function remove(id: string) {
    start(async () => {
      const res = await deleteExperience(id, candidateId);
      if (res.success) {
        toast.success("Experience removed.");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
          <Briefcase className="size-4 text-secondary" /> Work Experience
        </h2>
        {!adding && (
          <Button variant="outline" size="xs" onClick={() => { setAdding(true); setEditingId(null); }}>
            <Plus /> Add
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {adding && (
          <ExperienceRow candidateId={candidateId} onDone={() => setAdding(false)} />
        )}

        {experience.length === 0 && !adding ? (
          <p className="text-xs text-muted-foreground">
            No structured experience yet. Add entries to enrich the generated résumé.
          </p>
        ) : (
          experience.map((exp) =>
            editingId === exp.id ? (
              <ExperienceRow
                key={exp.id}
                candidateId={candidateId}
                entry={exp}
                onDone={() => setEditingId(null)}
              />
            ) : (
              <div
                key={exp.id}
                className="group flex items-start justify-between gap-3 rounded-xl border border-border p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{exp.title || "Role"}</p>
                  <p className="text-xs text-muted-foreground">
                    {exp.company || "—"} · {fmtRange(exp.start_date, exp.end_date, exp.is_current)}
                  </p>
                  {exp.description && (
                    <p className="mt-1.5 line-clamp-3 text-xs text-foreground/70">{exp.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => { setEditingId(exp.id); setAdding(false); }}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Edit"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => remove(exp.id)}
                    disabled={pending}
                    className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                    aria-label="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ),
          )
        )}
      </div>
    </section>
  );
}

// ── Education ─────────────────────────────────────────────────────────────────

function EducationRow({
  candidateId,
  entry,
  onDone,
}: {
  candidateId: string;
  entry?: Education;
  onDone: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("candidateId", candidateId);
    if (entry) fd.set("entryId", entry.id);
    start(async () => {
      const res = await saveEducation(fd);
      if (res.success) {
        toast.success("Education saved.");
        router.refresh();
        onDone();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-primary/30 bg-muted/30 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label className="mb-1 text-xs">Degree</Label>
          <Input name="degree" defaultValue={entry?.degree ?? ""} placeholder="B.Sc." />
        </div>
        <div>
          <Label className="mb-1 text-xs">Field of study</Label>
          <Input name="fieldOfStudy" defaultValue={entry?.field_of_study ?? ""} placeholder="Computer Science" />
        </div>
        <div>
          <Label className="mb-1 text-xs">Institution</Label>
          <Input name="institution" defaultValue={entry?.institution ?? ""} placeholder="University name" />
        </div>
        <div>
          <Label className="mb-1 text-xs">Graduation year</Label>
          <Input name="graduationYear" defaultValue={entry?.graduation_year ?? ""} placeholder="2020" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone} disabled={pending}>
          <X /> Cancel
        </Button>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Check />} Save
        </Button>
      </div>
    </form>
  );
}

export function EducationEditor({
  candidateId,
  education,
}: {
  candidateId: string;
  education: Education[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function remove(id: string) {
    start(async () => {
      const res = await deleteEducation(id, candidateId);
      if (res.success) {
        toast.success("Education removed.");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
          <GraduationCap className="size-4 text-secondary" /> Education
        </h2>
        {!adding && (
          <Button variant="outline" size="xs" onClick={() => { setAdding(true); setEditingId(null); }}>
            <Plus /> Add
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {adding && <EducationRow candidateId={candidateId} onDone={() => setAdding(false)} />}

        {education.length === 0 && !adding ? (
          <p className="text-xs text-muted-foreground">
            No structured education yet. Add entries to enrich the generated résumé.
          </p>
        ) : (
          education.map((ed) =>
            editingId === ed.id ? (
              <EducationRow
                key={ed.id}
                candidateId={candidateId}
                entry={ed}
                onDone={() => setEditingId(null)}
              />
            ) : (
              <div
                key={ed.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-border p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {ed.degree || "Qualification"}
                    {ed.field_of_study ? `, ${ed.field_of_study}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ed.institution || "—"}
                    {ed.graduation_year ? ` · ${ed.graduation_year}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => { setEditingId(ed.id); setAdding(false); }}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Edit"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => remove(ed.id)}
                    disabled={pending}
                    className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                    aria-label="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ),
          )
        )}
      </div>
    </section>
  );
}
