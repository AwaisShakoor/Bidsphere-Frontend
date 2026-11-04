export function MarketplaceCardsSkeleton({ count = 10 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="overflow-hidden rounded-xl bg-card ring-1 ring-primary/15"
        >
          <div className="aspect-square w-full animate-pulse bg-muted" />
          <div className="space-y-2 border-t border-primary/15 bg-linear-to-b from-accent/80 to-card p-3">
            <div className="h-3.5 w-full animate-pulse rounded bg-muted/80" />
            <div className="h-4 w-14 animate-pulse rounded-md bg-primary/20" />
            <div className="space-y-1 border-t border-primary/15 pt-2">
              <div className="flex justify-between gap-2">
                <div className="h-4 w-16 animate-pulse rounded bg-primary/30" />
                <div className="h-3 w-14 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
