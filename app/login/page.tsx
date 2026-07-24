import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/LoginForm";
import { BRAND } from "@/lib/brand";

export const metadata = { title: "Staff Login" };

export default async function LoginPage() {
  // Already signed in and active? Skip straight to the dashboard.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_active")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.is_active) redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white shadow-sm">
            {BRAND.logo.glyph}
          </div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent">
            Internal System
          </span>
          <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-foreground">
            {BRAND.wordmark} Dashboard
          </h1>
          <p className="mt-2 text-xs font-light leading-relaxed text-foreground/60">
            Restricted to authorized agency staff. If you don&apos;t have an account, contact your
            administrator.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-7 shadow-md">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-foreground/40">
          <ShieldCheck className="size-3.5" />
          <span>Secured access · Role-based permissions</span>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-foreground/50 hover:text-primary hover:underline">
            ← Back to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
