import { redirect } from "next/navigation";
import { requireActiveProfile, isAdminRole } from "@/lib/auth/session";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const profile = await requireActiveProfile();
  if (!isAdminRole(profile.role)) redirect("/dashboard");

  return (
    <ComingSoon
      title="Settings"
      description="Manage staff users, roles, and per-user permission grants for sensitive data."
      phase="Phase 7"
    />
  );
}
