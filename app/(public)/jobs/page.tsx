"use client";

import { useRouter } from "next/navigation";
import JobsPage from "@/components/public/JobsPage";

export default function Page() {
  const router = useRouter();
  return (
    <JobsPage
      onApplyForJob={(jobTitle) =>
        router.push(`/candidates?role=${encodeURIComponent(jobTitle)}`)
      }
    />
  );
}
