"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  ClipboardList,
  FileText,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import type { Profile } from "@/lib/auth/session";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
};

const NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Candidates", href: "/dashboard/candidates", icon: Users },
  { label: "Employers", href: "/dashboard/employers", icon: Building2 },
  { label: "Hiring Requests", href: "/dashboard/hiring-requests", icon: ClipboardList },
  { label: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { label: "Applications", href: "/dashboard/applications", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, adminOnly: true },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export function DashboardSidebar({
  profile,
  onNavigate,
}: {
  profile: Pick<Profile, "role">;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isAdmin = profile.role === "super_admin" || profile.role === "admin";
  const items = NAV.filter((i) => !i.adminOnly || isAdmin);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand lockup */}
      <div className="flex h-16 items-center justify-between gap-2 border-b border-sidebar-border px-5">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onNavigate}>
          <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            {BRAND.logo.glyph}
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm font-bold tracking-tight text-white">
              {BRAND.wordmark}
            </span>
            <span className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-sidebar-foreground/60">
              RMS Dashboard
            </span>
          </div>
        </Link>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="rounded-md p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-5 py-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-sidebar-foreground/40">
          {BRAND.name} · v1
        </p>
      </div>
    </div>
  );
}
