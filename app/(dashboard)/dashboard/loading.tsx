import { OverviewSkeleton } from "@/components/dashboard/Skeletons";

// Instant paint for the dashboard home while its counts/recent list load.
export default function Loading() {
  return <OverviewSkeleton />;
}
