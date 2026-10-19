export function ItemDetailSkeleton() {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-md shadow-primary/5 ring-1 ring-border">
      <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-8 w-64 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-48 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
