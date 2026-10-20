const ITEM_LIST_GRID =
  "sm:grid-cols-[minmax(0,1.8fr)_7rem_minmax(6rem,1fr)_minmax(7rem,1fr)_5.5rem]";

export function ItemListSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
      <div
        className={`hidden gap-3 border-b border-border px-4 py-3 sm:grid sm:items-center ${ITEM_LIST_GRID}`}
      >
        <div className="h-3 w-10 animate-pulse rounded bg-muted" />
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="h-3 w-14 animate-pulse rounded bg-muted" />
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="ml-auto h-3 w-14 animate-pulse rounded bg-muted" />
      </div>

      <ul className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, index) => (
          <li
            key={index}
            className={`grid gap-3 px-4 py-4 sm:items-center ${ITEM_LIST_GRID}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="size-12 shrink-0 animate-pulse rounded-lg bg-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                <div className="h-3 w-56 max-w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="h-5 w-16 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="flex justify-end gap-1">
              <div className="size-8 animate-pulse rounded-lg bg-muted" />
              <div className="size-8 animate-pulse rounded-lg bg-muted" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
