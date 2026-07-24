import { cn } from "@/lib/utils";
import type { Database } from "@/lib/database.types";

type CandidateStatus = Database["public"]["Enums"]["candidate_status"];

const STATUS_STYLES: Record<CandidateStatus, { label: string; className: string; dot: string }> = {
  new: { label: "New", className: "bg-slate-100 text-slate-700", dot: "bg-slate-400" },
  screening: { label: "Screening", className: "bg-sky-50 text-sky-700", dot: "bg-sky-500" },
  shortlisted: { label: "Shortlisted", className: "bg-indigo-50 text-indigo-700", dot: "bg-indigo-500" },
  submitted: { label: "Submitted", className: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
  interviewing: { label: "Interviewing", className: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  offered: { label: "Offered", className: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  placed: { label: "Placed", className: "bg-green-100 text-green-800", dot: "bg-green-600" },
  rejected: { label: "Rejected", className: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
  on_hold: { label: "On Hold", className: "bg-zinc-100 text-zinc-600", dot: "bg-zinc-400" },
};

export function CandidateStatusBadge({
  status,
  className,
}: {
  status: CandidateStatus;
  className?: string;
}) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        s.className,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export const CANDIDATE_STATUSES: CandidateStatus[] = [
  "new",
  "screening",
  "shortlisted",
  "submitted",
  "interviewing",
  "offered",
  "placed",
  "rejected",
  "on_hold",
];

type EmployerStatus = Database["public"]["Enums"]["employer_status"];
const EMPLOYER_STYLES: Record<EmployerStatus, { label: string; className: string; dot: string }> = {
  prospect: { label: "Prospect", className: "bg-sky-50 text-sky-700", dot: "bg-sky-500" },
  active: { label: "Active", className: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  inactive: { label: "Inactive", className: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
};

export function EmployerStatusBadge({ status, className }: { status: EmployerStatus; className?: string }) {
  const s = EMPLOYER_STYLES[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold", s.className, className)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

type HiringStatus = Database["public"]["Enums"]["hiring_request_status"];
const HIRING_STYLES: Record<HiringStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-amber-50 text-amber-700" },
  under_review: { label: "Under Review", className: "bg-sky-50 text-sky-700" },
  approved: { label: "Approved", className: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Rejected", className: "bg-rose-50 text-rose-700" },
  published: { label: "Published", className: "bg-green-100 text-green-800" },
};

export function HiringStatusBadge({ status, className }: { status: HiringStatus; className?: string }) {
  const s = HIRING_STYLES[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", s.className, className)}>
      {s.label}
    </span>
  );
}
