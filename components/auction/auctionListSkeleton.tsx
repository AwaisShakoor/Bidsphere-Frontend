import { Skeleton } from "@/components/ui/skeleton";

const AUCTION_LIST_GRID =
  "sm:grid-cols-[minmax(0,1.6fr)_6.5rem_6.5rem_minmax(8rem,0.9fr)_9.5rem]";

export function AuctionListSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
      <div
        className={`hidden gap-3 border-b border-border px-4 py-3 sm:grid sm:items-center ${AUCTION_LIST_GRID}`}
      >
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-10" />
        <Skeleton className="ml-auto h-3 w-14" />
      </div>

      <ul className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, index) => (
          <li
            key={index}
            className={`grid gap-3 px-4 py-4 sm:items-center ${AUCTION_LIST_GRID}`}
          >
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56 max-w-full" />
            </div>
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-28" />
            <div className="flex items-center justify-end gap-1.5">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
