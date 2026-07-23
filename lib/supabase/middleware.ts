import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Refreshes the Supabase auth session on every request and keeps cookies in sync.
 *
 * Phase 4 will extend this to enforce access control: redirect unauthenticated
 * users away from the `/dashboard` zone and check role claims. For now it only
 * keeps the session token fresh, and no-ops safely until Supabase keys are set.
 */
export async function updateSession(request: NextRequest) {
  // Until the Supabase environment keys are configured, do nothing.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: refreshing the session must happen here (do not remove).
  await supabase.auth.getUser();

  // Phase 4: add `/dashboard` protection here, e.g.
  //   const { data: { user } } = await supabase.auth.getUser();
  //   if (!user && request.nextUrl.pathname.startsWith("/dashboard")) redirect to /login

  return supabaseResponse;
}
