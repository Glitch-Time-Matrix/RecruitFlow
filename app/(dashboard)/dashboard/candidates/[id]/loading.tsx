import { DetailPageSkeleton } from "@/components/dashboard/Skeletons";

// Instant paint for a candidate profile while its record + documents load.
export default function Loading() {
  return <DetailPageSkeleton />;
}
