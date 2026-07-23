"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CandidatesPage from "@/components/public/CandidatesPage";

/** Reads the optional ?role= query (set when applying from a job listing). */
function CandidatesInner() {
  const params = useSearchParams();
  const role = params.get("role") ?? "";
  return <CandidatesPage prefilledJobTitle={role} />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CandidatesInner />
    </Suspense>
  );
}
