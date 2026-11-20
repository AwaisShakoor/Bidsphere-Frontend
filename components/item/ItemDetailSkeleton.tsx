export function ItemDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl bg-card p-5 shadow-md shadow-primary/10 ring-1 ring-primary/20 sm:p-6">
        <div className="flex gap-4 sm:gap-5">
          <div className="size-20 shrink-0 animate-pulse rounded-xl bg-muted sm:size-24" />
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="flex gap-2">
              <div className="h-5 w-14 animate-pulse rounded-md bg-muted" />
              <div className="h-5 w-20 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-7 w-64 max-w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
