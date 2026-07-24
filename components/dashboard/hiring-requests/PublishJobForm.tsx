"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Globe, Loader2, ExternalLink } from "lucide-react";
import { publishJobFromRequest } from "@/lib/actions/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type PublishDefaults = {
  requestId: string;
  title: string;
  department: string;
  location: string;
  salary_display: string;
  type: string;
  description: string;
  requirements: string;
};

export function PublishJobForm({ defaults }: { defaults: PublishDefaults }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const res = await publishJobFromRequest(fd);
    setSubmitting(false);
    if (res.success) {
      toast.success("Job published to the public site.", {
        description: "It now appears on the /jobs page.",
        action: res.slug
          ? { label: "View", onClick: () => window.open(`/jobs/${res.slug}`, "_blank") }
          : undefined,
      });
      router.refresh();
    } else {
      toast.error(res.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="requestId" value={defaults.requestId} />
      <div className="rounded-lg border border-accent/20 bg-accent/5 px-3.5 py-2.5 text-[11px] leading-relaxed text-foreground/70">
        Only the fields below appear publicly. Employer identity and contact details are never shown
        to candidates.
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs font-semibold">Job Title</Label>
          <Input name="title" defaultValue={defaults.title} required />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Department</Label>
          <Input name="department" defaultValue={defaults.department} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Location</Label>
          <Input name="location" defaultValue={defaults.location} placeholder="e.g. New York, NY / Hybrid" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Salary (displayed)</Label>
          <Input name="salary_display" defaultValue={defaults.salary_display} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Type</Label>
          <Input name="type" defaultValue={defaults.type} placeholder="e.g. Full-Time" />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-semibold">Public Description</Label>
        <Textarea name="description" defaultValue={defaults.description} rows={4} />
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-semibold">Requirements (one per line)</Label>
        <Textarea
          name="requirements"
          defaultValue={defaults.requirements}
          rows={4}
          placeholder={"5+ years experience\nStrong communication skills"}
        />
      </div>

      <Button type="submit" disabled={submitting} className="w-full gap-2">
        {submitting ? <Loader2 className="size-4 animate-spin" /> : <Globe className="size-4" />}
        {submitting ? "Publishing…" : "Publish to Public Site"}
      </Button>
    </form>
  );
}

export function PublishedNotice({ slug }: { slug: string }) {
  return (
    <a
      href={`/jobs/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm hover:bg-accent/10"
    >
      <span className="font-semibold text-foreground">Live on the public site</span>
      <span className="flex items-center gap-1.5 text-xs font-semibold text-accent">
        View <ExternalLink className="size-3.5" />
      </span>
    </a>
  );
}
