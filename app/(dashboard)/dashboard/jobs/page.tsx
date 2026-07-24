import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const metadata = { title: "Jobs" };

export default function JobsPage() {
  return (
    <ComingSoon
      title="Jobs"
      description="Published job listings that appear on the public site — created from approved hiring requests."
      phase="Phase 5"
    />
  );
}
