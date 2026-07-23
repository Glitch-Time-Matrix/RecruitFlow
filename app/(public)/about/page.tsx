"use client";

import { useRouter } from "next/navigation";
import AboutPage from "@/components/public/AboutPage";

export default function Page() {
  const router = useRouter();
  return (
    <AboutPage
      onNavigateCandidate={() => router.push("/candidates")}
      onNavigateEmployer={() => router.push("/employers")}
    />
  );
}
