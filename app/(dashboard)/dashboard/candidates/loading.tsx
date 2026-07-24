import { CandidatesPageSkeleton } from "@/components/dashboard/Skeletons";

// Instant paint for the candidates list while candidates + photo URLs load.
export default function Loading() {
  return <CandidatesPageSkeleton />;
}
