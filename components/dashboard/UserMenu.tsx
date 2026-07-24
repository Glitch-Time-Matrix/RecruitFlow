"use client";

import { LogOut, UserCircle } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import type { Profile } from "@/lib/auth/session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLE_LABELS: Record<Profile["role"], string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  recruiter: "Recruiter",
};

function initials(name: string, email: string): string {
  const src = name.trim() || email;
  const parts = src.split(/[\s@.]+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export function UserMenu({ profile }: { profile: Profile }) {
  const displayName = profile.full_name?.trim() || profile.email || "Staff";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="size-8 border border-border">
          {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName} />}
          <AvatarFallback className="bg-primary text-[11px] font-semibold uppercase text-white">
            {initials(profile.full_name ?? "", profile.email ?? "")}
          </AvatarFallback>
        </Avatar>
        <div className="hidden text-left sm:block">
          <p className="text-xs font-semibold leading-tight text-foreground">{displayName}</p>
          <p className="text-[10px] leading-tight text-muted-foreground">
            {ROLE_LABELS[profile.role]}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold">{displayName}</span>
          <span className="text-xs font-normal text-muted-foreground">{profile.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="gap-2 text-muted-foreground">
          <UserCircle className="size-4" />
          {ROLE_LABELS[profile.role]}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logout}>
          <button type="submit" className="w-full">
            <DropdownMenuItem asChild>
              <span className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                <LogOut className="size-4" />
                Sign out
              </span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
