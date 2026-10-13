import { Skeleton } from "@/components/ui/skeleton";

export function AuctionCardsSkeleton() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <li
          key={index}
          className="rounded-2xl bg-card p-4 shadow-md shadow-primary/5 ring-1 ring-border"
        >
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-14 rounded-md" />
          </div>
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-3/4" />
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="space-y-1.5 text-right">
              <Skeleton className="ml-auto h-3 w-10" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
