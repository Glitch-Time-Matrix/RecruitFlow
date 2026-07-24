import { Construction } from "lucide-react";

export function ComingSoon({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-20 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Construction className="size-6" />
        </div>
        <p className="text-sm font-semibold text-foreground">Coming in {phase}</p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          This section is part of the phased rollout. The foundation (data model, security, and
          navigation) is already in place.
        </p>
      </div>
    </div>
  );
}
