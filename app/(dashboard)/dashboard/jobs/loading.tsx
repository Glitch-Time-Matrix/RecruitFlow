import { TablePageSkeleton } from "@/components/dashboard/Skeletons";

// Instant paint for the jobs list while data loads.
export default function Loading() {
  return <TablePageSkeleton toolbar={false} cols={5} />;
}
