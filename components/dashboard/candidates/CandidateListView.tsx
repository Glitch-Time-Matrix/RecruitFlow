"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, Search, Users } from "lucide-react";
import type { CandidateListItem } from "@/lib/db/candidates";
import { cn } from "@/lib/utils";
import { CandidateStatusBadge, CANDIDATE_STATUSES } from "@/components/dashboard/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type View = "grid" | "table";
const VIEW_KEY = "rf.candidates.view";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function CandidateAvatar({ item, size }: { item: CandidateListItem; size: "sm" | "lg" }) {
  return (
    <Avatar className={cn("border border-border", size === "lg" ? "size-20" : "size-9")}>
      {item.photoUrl && <AvatarImage src={item.photoUrl} alt={item.full_name} className="object-cover" />}
      <AvatarFallback
        className={cn(
          "bg-primary/90 font-semibold text-white",
          size === "lg" ? "text-xl" : "text-xs",
        )}
      >
        {initials(item.full_name)}
      </AvatarFallback>
    </Avatar>
  );
}

export function CandidateListView({
  candidates,
  industries,
}: {
  candidates: CandidateListItem[];
  industries: string[];
}) {
  const [view, setView] = useState<View>("grid");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [industry, setIndustry] = useState<string>("all");

  useEffect(() => {
    const saved = window.localStorage.getItem(VIEW_KEY);
    if (saved === "grid" || saved === "table") setView(saved);
  }, []);

  function changeView(v: View) {
    setView(v);
    window.localStorage.setItem(VIEW_KEY, v);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return candidates.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (industry !== "all" && c.preferred_industry !== industry) return false;
      if (!q) return true;
      return [c.full_name, c.current_title, c.primary_skills, c.target_role, c.location, c.email]
        .filter(Boolean)
        .some((f) => f!.toLowerCase().includes(q));
    });
  }, [candidates, search, status, industry]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, title, skills, role…"
            className="h-10 pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {CANDIDATE_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="h-10 w-[170px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All industries</SelectItem>
              {industries.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border bg-white p-0.5">
            <button
              onClick={() => changeView("grid")}
              className={cn(
                "flex size-8 items-center justify-center rounded-md transition-colors",
                view === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted",
              )}
              aria-label="Card view"
              aria-pressed={view === "grid"}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => changeView("table")}
              className={cn(
                "flex size-8 items-center justify-center rounded-md transition-colors",
                view === "table" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted",
              )}
              aria-label="Table view"
              aria-pressed={view === "table"}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
        {candidates.length} candidates
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white py-16 text-center">
          <Users className="mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">No candidates found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : view === "grid" ? (
        /* ── CARD / GRID VIEW (social-style, photo-forward) ── */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/candidates/${c.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              {/* Mini cover band */}
              <div className="h-16 bg-gradient-to-r from-primary via-primary/85 to-secondary" />
              <div className="flex flex-col items-center px-6 pb-6">
                <div className="-mt-12">
                  <div className="rounded-full border-4 border-white bg-white shadow-sm">
                    <CandidateAvatar item={c} size="lg" />
                  </div>
                </div>
                <h3 className="mt-3 line-clamp-1 font-display text-base font-bold text-foreground group-hover:text-primary">
                  {c.full_name}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {c.current_title || c.target_role || "—"}
                </p>
                <div className="mt-3">
                  <CandidateStatusBadge status={c.status} />
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {c.total_experience && (
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground/70">
                      {c.total_experience}
                    </span>
                  )}
                  {c.location && (
                    <span className="line-clamp-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground/70">
                      {c.location}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* ── TABLE / LIST VIEW (dense) ── */
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Candidate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer">
                  <TableCell>
                    <Link href={`/dashboard/candidates/${c.id}`} className="flex items-center gap-3">
                      <CandidateAvatar item={c} size="sm" />
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-semibold text-foreground">
                          {c.full_name}
                        </p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {c.current_title || c.target_role || "—"}
                        </p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <CandidateStatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="text-xs text-foreground/70">
                    {c.total_experience || "—"}
                  </TableCell>
                  <TableCell className="text-xs text-foreground/70">{c.location || "—"}</TableCell>
                  <TableCell className="max-w-[220px]">
                    <p className="line-clamp-1 text-xs text-foreground/70">
                      {c.primary_skills || "—"}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
