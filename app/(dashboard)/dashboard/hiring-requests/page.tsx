import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata = { title: "Hiring Requests" };

export default function HiringRequestsPage() {
  return (
    <ComingSoon
      title="Hiring Requests"
      description="Review employer submissions and convert approved requests into published jobs."
      phase="Phase 5"
    />
  );
}
