import Link from "next/link";

/**
 * Phase 0 foundation page — temporary.
 * Confirms the Next.js + Tailwind + Supabase foundation is live.
 * Replaced by the migrated marketing home in Phase 1.
 */
export default function HomePage() {
  const supabaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const checks = [
    { label: "Next.js (App Router)", ok: true },
    { label: "TypeScript", ok: true },
    { label: "Tailwind CSS v4 + brand theme", ok: true },
    { label: "Supabase environment keys", ok: supabaseConfigured },
  ];

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex size-12 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-white shadow-sm select-none">
          Ω
        </div>
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
          Phase 0 · Foundation Live
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          RecruitFlow RMS
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-foreground/70">
          The Next.js + Supabase foundation is running. The approved public site is
          migrated in Phase 1; the internal dashboard is built from Phase 4.
        </p>

        <div className="mx-auto mt-10 max-w-sm space-y-2 text-left">
          {checks.map((c) => (
            <div
              key={c.label}
              className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs"
            >
              <span className="font-medium text-foreground">{c.label}</span>
              <span
                className={
                  c.ok
                    ? "font-semibold text-accent"
                    : "font-semibold text-foreground/40"
                }
              >
                {c.ok ? "Ready" : "Add keys"}
              </span>
            </div>
          ))}
        </div>

        {!supabaseConfigured && (
          <p className="mx-auto mt-6 max-w-sm text-[11px] font-light leading-relaxed text-foreground/50">
            Add your Supabase keys to <code className="font-mono">.env.local</code>{" "}
            (see <code className="font-mono">.env.example</code>) to complete the connection.
          </p>
        )}

        <div className="mt-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-xl border border-border bg-white px-5 py-2.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            View dashboard placeholder →
          </Link>
        </div>
      </div>
    </main>
  );
}
