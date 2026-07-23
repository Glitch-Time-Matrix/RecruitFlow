import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow intake file uploads (resume/JD up to 10MB, photo up to 5MB) through
    // Server Actions. Default is 1MB, which would reject real documents.
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
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
