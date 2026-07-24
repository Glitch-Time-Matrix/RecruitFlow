import { DetailPageSkeleton } from "@/components/dashboard/Skeletons";

// Instant paint for an employer profile while its record loads.
export default function Loading() {
  return <DetailPageSkeleton />;
}
