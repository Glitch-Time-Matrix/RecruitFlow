import Link from "next/link";

/**
 * Phase 0 dashboard placeholder.
 * Becomes the auth-gated operational overview in Phase 4 (doc 04, D2).
 */
export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <div className="w-full max-w-lg text-center">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-secondary">
          Internal · Dashboard
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">
          Dashboard placeholder
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm font-light leading-relaxed text-foreground/70">
          The auth-gated agency dashboard is built from Phase 4. This route group is
          protected by middleware once Supabase Auth is wired up.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-xl border border-border bg-white px-5 py-2.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          ← Back to site
        </Link>
      </div>
    </main>
  );
}
