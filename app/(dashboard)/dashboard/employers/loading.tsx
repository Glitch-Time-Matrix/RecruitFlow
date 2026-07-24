import { TablePageSkeleton } from "@/components/dashboard/Skeletons";

// Instant paint for the employers list while data loads.
export default function Loading() {
  return <TablePageSkeleton toolbar cols={5} />;
}
