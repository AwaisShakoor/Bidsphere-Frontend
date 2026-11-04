export function PublicItemDetailSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/10 ring-1 ring-primary/20">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col">
          <div className="min-h-72 animate-pulse bg-muted lg:min-h-112" />
          <div className="flex gap-2 border-t border-border/70 bg-card p-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="size-16 shrink-0 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        </div>
        <div className="space-y-5 bg-linear-to-br from-accent/70 via-card to-card p-5 sm:p-6 lg:p-8">
          <div className="flex gap-2">
            <div className="h-5 w-16 animate-pulse rounded-md bg-primary/20" />
            <div className="h-5 w-20 animate-pulse rounded-md bg-primary/15" />
          </div>
          <div className="h-8 w-64 max-w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
          <div className="h-11 w-full animate-pulse rounded-lg bg-primary/20" />
          <div className="grid gap-2.5 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
