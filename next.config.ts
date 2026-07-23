import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers applied to every route. Extended in a later phase (CSP, HSTS).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  images: {
    // Supabase Storage signed URLs are served from the project domain; allow-list added
    // once the Supabase project URL is known (kept empty + safe for now).
    remotePatterns: [],
  },
};

export default nextConfig;
