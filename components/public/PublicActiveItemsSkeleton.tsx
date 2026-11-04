import { MarketplaceCardsSkeleton } from "@/components/marketplace/MarketplaceCardsSkeleton";

export function PublicActiveItemsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        <div className="border-b border-border/70 bg-linear-to-br from-primary/8 via-card to-card p-3 sm:p-4">
          <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="bg-card px-3 py-3 sm:px-4">
          <div className="mb-2 h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="flex flex-wrap gap-2.5">
            {Array.from({ length: 11 }).map((_, index) => (
              <div
                key={index}
                className="h-9 w-28 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="h-4 w-28 animate-pulse rounded bg-muted" />

      <MarketplaceCardsSkeleton />
    </div>
  );
}
