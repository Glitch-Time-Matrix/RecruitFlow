"use client";

import { useRouter } from "next/navigation";
import ServicesPage from "@/components/public/ServicesPage";

export default function Page() {
  const router = useRouter();
  return <ServicesPage onNavigateEmployer={() => router.push("/employers")} />;
}
