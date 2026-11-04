export function PublicItemBidHistorySkeleton() {
  return (
    <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/10 ring-1 ring-primary/20">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="size-4 animate-pulse rounded bg-muted" />
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
      </div>

      <div className="space-y-4 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/15 bg-primary/5 px-3.5 py-3">
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-primary/20" />
            <div className="h-4 w-36 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-7 w-20 animate-pulse rounded bg-primary/20" />
        </div>

        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 py-1"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-40 animate-pulse rounded bg-muted" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-14 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
