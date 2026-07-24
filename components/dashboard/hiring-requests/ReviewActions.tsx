"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Eye } from "lucide-react";
import { reviewHiringRequest } from "@/lib/actions/jobs";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/database.types";

type Status = Database["public"]["Enums"]["hiring_request_status"];

export function ReviewActions({ id, status }: { id: string; status: Status }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);

  function act(next: "under_review" | "approved" | "rejected", label: string) {
    setBusy(next);
    startTransition(async () => {
      const res = await reviewHiringRequest(id, next);
      setBusy(null);
      if (res.success) {
        toast.success(`Request ${label}.`);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  if (status === "published") {
    return <p className="text-xs text-muted-foreground">This request has been published as a job.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "new" && (
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => act("under_review", "marked under review")}
          className="gap-1.5"
        >
          <Eye className="size-3.5" /> {busy === "under_review" ? "…" : "Under Review"}
        </Button>
      )}
      {status !== "approved" && (
        <Button
          size="sm"
          disabled={pending}
          onClick={() => act("approved", "approved")}
          className="gap-1.5 bg-accent text-white hover:bg-accent/90"
        >
          <CheckCircle2 className="size-3.5" /> {busy === "approved" ? "…" : "Approve"}
        </Button>
      )}
      {status !== "rejected" && (
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => act("rejected", "rejected")}
          className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/5"
        >
          <XCircle className="size-3.5" /> {busy === "rejected" ? "…" : "Reject"}
        </Button>
      )}
    </div>
  );
}
