import Link from "next/link";
import { Users, Building2, ClipboardList, Briefcase, FileText, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireActiveProfile } from "@/lib/auth/session";
import { listCandidates } from "@/lib/db/candidates";
import { CandidateStatusBadge } from "@/components/dashboard/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata = { title: "Overview" };

async function count(table: "candidates" | "employers" | "jobs" | "applications") {
  const supabase = await createClient();
  const q = supabase.from(table).select("*", { count: "exact", head: true });
  const scoped = table === "candidates" || table === "employers" ? q.is("deleted_at", null) : q;
  const { count } = await scoped;
  return count ?? 0;
}

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

export default async function OverviewPage() {
  const profile = await requireActiveProfile();
  const supabase = await createClient();

  const [candidates, employers, jobs, applications] = await Promise.all([
    count("candidates"),
    count("employers"),
    count("jobs"),
    count("applications"),
  ]);
  const { count: newRequests } = await supabase
    .from("hiring_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  const recent = (await listCandidates()).slice(0, 5);

  const firstName = (profile.full_name || profile.email || "there").split(/[\s@]/)[0];

  const stats = [
    { label: "Candidates", value: candidates, icon: Users, href: "/dashboard/candidates", accent: "text-accent bg-accent/10" },
    { label: "Employers", value: employers, icon: Building2, href: "/dashboard/employers", accent: "text-secondary bg-secondary/10" },
    { label: "New Hiring Requests", value: newRequests ?? 0, icon: ClipboardList, href: "/dashboard/hiring-requests", accent: "text-amber-600 bg-amber-50" },
    { label: "Active Jobs", value: jobs, icon: Briefcase, href: "/dashboard/jobs", accent: "text-primary bg-primary/10" },
    { label: "Applications", value: applications, icon: FileText, href: "/dashboard/applications", accent: "text-violet-600 bg-violet-50" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across your recruitment pipeline.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`mb-3 flex size-9 items-center justify-center rounded-lg ${s.accent}`}>
                <Icon className="size-4.5" />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">{s.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent candidates */}
      <div className="rounded-2xl border border-border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-sm font-bold text-foreground">Recent Candidates</h2>
          <Link
            href="/dashboard/candidates"
            className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            No candidates yet. They&apos;ll appear here as people apply on the public site.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/dashboard/candidates/${c.id}`}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
                >
                  <Avatar className="size-9 border border-border">
                    {c.photoUrl && <AvatarImage src={c.photoUrl} alt={c.full_name} className="object-cover" />}
                    <AvatarFallback className="bg-primary/90 text-xs font-semibold text-white">
                      {initials(c.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-foreground">{c.full_name}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {c.current_title || c.target_role || "—"}
                    </p>
                  </div>
                  <CandidateStatusBadge status={c.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
