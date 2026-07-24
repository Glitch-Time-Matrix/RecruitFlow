import { requireActiveProfile } from "@/lib/auth/session";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Toaster } from "@/components/ui/sonner";

/**
 * Dashboard zone layout — internal agency users only.
 * Server-side auth guard: `requireActiveProfile` redirects to /login unless the
 * caller has an active profile. Middleware also blocks the route; this is the
 * second layer. RLS in the database is the third.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireActiveProfile();

  return (
    <>
      <DashboardShell profile={profile}>{children}</DashboardShell>
      <Toaster position="top-right" />
    </>
  );
}
