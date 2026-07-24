import JobsPage from "@/components/public/JobsPage";
import { listPublishedJobs } from "@/lib/db/jobs";

export const metadata = {
  title: "Open Jobs",
  description: "Explore active executive and technical placements across top corporate employers.",
};

// Revalidated on-demand when a job is published/unpublished (revalidatePath),
// with a periodic fallback so the public listing stays fresh.
export const revalidate = 300;

export default async function Page() {
  const jobs = await listPublishedJobs();
  return <JobsPage jobs={jobs} />;
}
