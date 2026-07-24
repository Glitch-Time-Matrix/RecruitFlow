import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run the session refresh on real page/API navigations only. Skip:
     * - _next/static, _next/image (build assets, never carry a session)
     * - the metadata/static files below (favicon, robots, sitemap, manifest)
     * - anything with a static asset extension (fonts, images, media, maps)
     *
     * This keeps the Supabase session-refresh + /dashboard guard on every route
     * that actually needs auth, while removing a needless auth round-trip from
     * asset requests. Security is unchanged: no protected route is excluded.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff|woff2|ttf|otf|eot|mp4|webm|txt)$).*)",
  ],
};
