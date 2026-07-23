"use client";

import { useRouter } from "next/navigation";
import IndustriesPage from "@/components/public/IndustriesPage";

export default function Page() {
  const router = useRouter();
  return (
    <IndustriesPage
      onNavigateCandidate={() => router.push("/candidates")}
      onNavigateEmployer={() => router.push("/employers")}
    />
  );
}
