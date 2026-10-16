export function AuctionCardsSkeleton() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <li
          key={index}
          className="overflow-hidden rounded-2xl bg-card p-4 shadow-md shadow-primary/5 ring-1 ring-border"
        >
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />
          <div className="mt-1 h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="space-y-1.5">
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            </div>
            <div className="space-y-1.5 text-right">
              <div className="ml-auto h-3 w-10 animate-pulse rounded bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
