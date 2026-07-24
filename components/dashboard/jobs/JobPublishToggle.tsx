"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { unpublishJob, republishJob } from "@/lib/actions/jobs";
import { Button } from "@/components/ui/button";

export function JobPublishToggle({ jobId, isPublished }: { jobId: string; isPublished: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const res = isPublished ? await unpublishJob(jobId) : await republishJob(jobId);
      if (res.success) {
        toast.success(isPublished ? "Job unpublished." : "Job published.");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <Button variant="outline" size="sm" disabled={pending} onClick={toggle} className="gap-1.5">
      {isPublished ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
      {isPublished ? "Unpublish" : "Publish"}
    </Button>
  );
}
