export function PublicItemBidHistorySkeleton() {
  return (
    <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="size-4 animate-pulse rounded bg-muted" />
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-5 w-14 animate-pulse rounded bg-muted" />
      </div>

      <div className="space-y-3 px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2.5">
          <div className="space-y-1.5">
            <div className="h-3 w-16 animate-pulse rounded bg-primary/20" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-6 w-16 animate-pulse rounded bg-primary/20" />
        </div>

        <div className="divide-y divide-border/70">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 py-2.5"
            >
              <div className="space-y-1.5">
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                <div className="h-3 w-36 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-4 w-14 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
