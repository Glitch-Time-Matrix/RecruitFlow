import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route-level loading skeletons for the dashboard. These render INSTANTLY on
 * navigation (via each route's `loading.tsx` Suspense boundary) while the server
 * component fetches its data, so a click paints immediately instead of stalling
 * on Supabase round-trips. Shapes mirror the real pages to avoid layout shift.
 */

/** Page title + subtitle + primary action, matching the standard page header. */
export function PageHeaderSkeleton({ action = true }: { action?: boolean }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      {action && <Skeleton className="h-10 w-36 rounded-md" />}
    </div>
  );
}

/** Toolbar row: search + a couple of filters + view toggle. */
function ToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <Skeleton className="h-10 w-full lg:max-w-md" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[170px]" />
        <Skeleton className="h-10 w-[72px] rounded-lg" />
      </div>
    </div>
  );
}

/** Grid of photo-forward candidate cards. */
export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col rounded-[26px] border border-border/70 bg-white p-2.5">
          <Skeleton className="aspect-square w-full rounded-[20px]" />
          <div className="space-y-2 px-3 pb-2 pt-4">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** A candidate-style list page: header + toolbar + card grid. */
export function CandidatesPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeaderSkeleton />
      <ToolbarSkeleton />
      <Skeleton className="h-3 w-40" />
      <CardGridSkeleton />
    </div>
  );
}

/** Generic dense table skeleton (employers, jobs, applications, requests). */
export function TableSkeleton({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex items-center gap-4 border-b border-border px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-4 py-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** A list page that renders as a table (header + optional toolbar + table). */
export function TablePageSkeleton({
  toolbar = true,
  cols = 5,
}: {
  toolbar?: boolean;
  cols?: number;
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeaderSkeleton />
      {toolbar && <ToolbarSkeleton />}
      <TableSkeleton cols={cols} />
    </div>
  );
}

/** Overview / dashboard home: stat cards + a recent list. */
export function OverviewSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-white p-5">
            <Skeleton className="mb-3 size-9 rounded-lg" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Detail page (candidate/employer profile): cover header + body columns. */
export function DetailPageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <Skeleton className="h-28 w-full rounded-none" />
        <div className="px-6 pb-6">
          <Skeleton className="-mt-14 size-28 rounded-full border-4 border-white" />
          <Skeleton className="mt-4 h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    </div>
  );
}
