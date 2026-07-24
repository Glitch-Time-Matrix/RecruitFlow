"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";
import type { ApplicationCard, ApplicationStage } from "@/lib/db/applications";
import { updateApplicationStage } from "@/lib/actions/applications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STAGES: { key: ApplicationStage; label: string; accent: string }[] = [
  { key: "applied", label: "Applied", accent: "border-t-slate-400" },
  { key: "screening", label: "Screening", accent: "border-t-sky-500" },
  { key: "submitted_to_client", label: "Submitted", accent: "border-t-violet-500" },
  { key: "interview", label: "Interview", accent: "border-t-amber-500" },
  { key: "offer", label: "Offer", accent: "border-t-emerald-500" },
  { key: "hired", label: "Hired", accent: "border-t-green-600" },
  { key: "rejected", label: "Rejected", accent: "border-t-rose-500" },
  { key: "withdrawn", label: "Withdrawn", accent: "border-t-zinc-400" },
];

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

function Card({ app }: { app: ApplicationCard }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function move(stage: string) {
    startTransition(async () => {
      const res = await updateApplicationStage(app.id, stage as ApplicationStage);
      if (res.success) {
        toast.success("Application moved.");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <div className="space-y-2.5 rounded-xl border border-border bg-white p-3 shadow-sm">
      <Link href={`/dashboard/candidates/${app.candidateId}`} className="flex items-center gap-2.5">
        <Avatar className="size-8 border border-border">
          {app.candidatePhotoUrl && (
            <AvatarImage src={app.candidatePhotoUrl} alt={app.candidateName} className="object-cover" />
          )}
          <AvatarFallback className="bg-primary/90 text-[10px] font-semibold text-white">
            {initials(app.candidateName)}
          </AvatarFallback>
        </Avatar>
        <p className="line-clamp-1 text-xs font-semibold text-foreground hover:text-primary">
          {app.candidateName}
        </p>
      </Link>
      {app.jobTitle && (
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Briefcase className="size-3 shrink-0" />
          <span className="line-clamp-1">{app.jobTitle}</span>
        </p>
      )}
      <Select value={app.stage} onValueChange={move} disabled={pending}>
        <SelectTrigger className="h-7 text-[11px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STAGES.map((s) => (
            <SelectItem key={s.key} value={s.key} className="text-xs">
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ApplicationsBoard({ applications }: { applications: ApplicationCard[] }) {
  const grouped = useMemo(() => {
    const map = new Map<ApplicationStage, ApplicationCard[]>();
    STAGES.forEach((s) => map.set(s.key, []));
    applications.forEach((a) => map.get(a.stage)?.push(a));
    return map;
  }, [applications]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map((s) => {
        const items = grouped.get(s.key) ?? [];
        return (
          <div key={s.key} className="w-64 shrink-0">
            <div className={`rounded-t-xl border-t-2 ${s.accent} bg-muted/50 px-3 py-2.5`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{s.label}</span>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {items.length}
                </span>
              </div>
            </div>
            <div className="min-h-[120px] space-y-2.5 rounded-b-xl bg-muted/30 p-2.5">
              {items.length === 0 ? (
                <p className="py-6 text-center text-[11px] text-muted-foreground/60">No applications</p>
              ) : (
                items.map((app) => <Card key={app.id} app={app} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
