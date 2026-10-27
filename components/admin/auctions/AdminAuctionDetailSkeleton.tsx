import { cn } from "@/lib/utils";

function Pulse({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded bg-muted", className)} />
  );
}

export function AdminAuctionDetailSkeleton() {
  return (
    <div className="relative flex flex-col gap-5" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading auction details...</span>

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Pulse className="h-8 w-36" />
          <div className="flex flex-wrap items-center gap-2.5">
            <Pulse className="h-8 w-56 max-w-full sm:h-9 sm:w-72" />
            <Pulse className="h-5 w-24 rounded-full" />
          </div>
          <Pulse className="h-4 w-full max-w-xl" />
          <Pulse className="h-4 w-80 max-w-full" />
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Pulse className="h-10 w-28 rounded-lg" />
          <Pulse className="h-10 w-24 rounded-lg" />
        </div>
      </div>

      <section className="relative">
        <Pulse className="h-4 w-36" />
        <div className="mt-3 overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-sm shadow-primary/5">
          <div className="flex flex-col gap-3 border-b border-primary/10 bg-primary/8 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <Pulse className="size-12 shrink-0 rounded-full" />
              <div className="min-w-0 space-y-2">
                <Pulse className="h-4 w-16 rounded-full" />
                <Pulse className="h-4 w-40" />
                <Pulse className="h-6 w-48 rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-primary/15 bg-primary/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <Pulse className="size-9 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Pulse className="h-3 w-14" />
                    <Pulse className="h-4 w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative flex flex-col gap-4">
        <div className="space-y-2">
          <Pulse className="h-4 w-28" />
          <Pulse className="ml-3 h-4 w-72 max-w-full" />
        </div>

        <ul className="space-y-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <li
              key={index}
              className="overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-sm shadow-primary/5"
            >
              <div className="flex items-center justify-between gap-3 border-b border-primary/10 bg-primary/8 px-4 py-2.5 sm:px-5">
                <Pulse className="h-3 w-24" />
                <Pulse className="h-5 w-20 rounded-md" />
              </div>

              <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[14rem_minmax(0,1fr)]">
                <Pulse className="aspect-square w-full rounded-xl" />
                <div className="min-w-0 space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pulse className="h-6 w-48 max-w-full" />
                      <Pulse className="h-5 w-16 rounded-md" />
                    </div>
                    <Pulse className="h-4 w-full" />
                    <Pulse className="h-4 w-2/3 max-w-md" />
                  </div>
                  <div className="space-y-2 rounded-xl bg-accent/60 px-3 py-2 sm:px-4">
                    {Array.from({ length: 4 }).map((_, row) => (
                      <div
                        key={row}
                        className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-3 py-1.5 sm:grid-cols-[10rem_minmax(0,1fr)]"
                      >
                        <Pulse className="h-4 w-24" />
                        <Pulse className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
