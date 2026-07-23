/**
 * Dashboard zone layout — internal agency users only.
 *
 * Auth guard (Supabase session + role check) and the dashboard shell are added
 * in Phase 4. For now this is a structural placeholder so the route group exists.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-muted/30">{children}</div>;
}
