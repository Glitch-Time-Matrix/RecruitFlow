"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Building2 } from "lucide-react";
import type { EmployerListItem } from "@/lib/db/employers";
import { EmployerStatusBadge } from "@/components/dashboard/StatusBadge";
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

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function EmployerListView({ employers }: { employers: EmployerListItem[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const industries = useMemo(() => {
    const set = new Set<string>();
    employers.forEach((e) => e.industry && set.add(e.industry));
    return Array.from(set).sort();
  }, [employers]);
  const [industry, setIndustry] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return employers.filter((e) => {
      if (status !== "all" && e.status !== status) return false;
      if (industry !== "all" && e.industry !== industry) return false;
      if (!q) return true;
      return [e.company_name, e.industry, e.website_url]
        .filter(Boolean)
        .some((f) => f!.toLowerCase().includes(q));
    });
  }, [employers, search, status, industry]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, industry…"
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
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
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
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
        {employers.length} employers
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white py-16 text-center">
          <Building2 className="mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">No employers found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Employers appear here as companies submit hiring requests.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Company</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hiring Requests</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <Link href={`/dashboard/employers/${e.id}`} className="flex items-center gap-3">
                      <Avatar className="size-9 rounded-lg border border-border">
                        {e.logoUrl && <AvatarImage src={e.logoUrl} alt={e.company_name} className="object-contain" />}
                        <AvatarFallback className="rounded-lg bg-secondary/10 text-xs font-semibold text-secondary">
                          {initials(e.company_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-semibold text-foreground">
                          {e.company_name}
                        </p>
                        {e.company_scale && (
                          <p className="line-clamp-1 text-xs text-muted-foreground">{e.company_scale}</p>
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-foreground/70">{e.industry || "—"}</TableCell>
                  <TableCell>
                    <EmployerStatusBadge status={e.status} />
                  </TableCell>
                  <TableCell className="text-xs text-foreground/70">
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-semibold">
                      {e.requestCount}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(e.created_at).toLocaleDateString()}
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
