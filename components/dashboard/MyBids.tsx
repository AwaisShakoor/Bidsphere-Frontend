"use client";

import Link from "next/link";
import { Clock, Gavel, Inbox } from "lucide-react";
import { BidStatus } from "@/enums/bidStatus";
import { formatDate, formatMoney, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useMyBids } from "@/services/hooks/BidServicesHook";
import type { MyBid } from "@/services/types/BidServicesTypes";

function bidStatusClass(status: string) {
  if (status === BidStatus.ACTIVE) {
    return "bg-primary/10 text-primary";
  }
  if (status === BidStatus.OUTBID) {
    return "bg-muted text-muted-foreground";
  }
  return "bg-muted text-muted-foreground";
}

function sortMyBids(bids: MyBid[]) {
  return [...bids].sort(
    (a, b) =>
      new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
  );
}

export function MyBids() {
  const { data: bids = [], isPending, isError, error } = useMyBids();
  const sortedBids = sortMyBids(bids);

  return (
    <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Gavel className="size-4 text-primary" aria-hidden />
          <h2 className="text-base font-semibold text-foreground">My bids</h2>
        </div>
        {!isPending && !isError ? (
          <p className="text-xs font-medium text-muted-foreground tabular-nums">
            {bids.length} {bids.length === 1 ? "bid" : "bids"}
          </p>
        ) : null}
      </div>

      <div className="px-5 py-4 sm:px-6">
        {isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Could not load bids."}
          </p>
        ) : bids.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Inbox className="size-8 text-muted-foreground/50" aria-hidden />
            <p className="text-sm text-muted-foreground">
              You haven&apos;t placed any bids yet.
            </p>
          </div>
        ) : (
          <ul className="max-h-80 divide-y divide-border/70 overflow-y-auto pr-1">
            {sortedBids.map((bid) => (
              <li key={bid.id} className="py-3 first:pt-0 last:pb-0">
                <Link
                  href={`/items/${bid.item.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg outline-none transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {bid.item.title || "Untitled"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bid.item.auction.title}
                    </p>
                    <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock
                        className="size-3 shrink-0 text-primary"
                        aria-hidden
                      />
                      Ends {formatDate(bid.item.auction.endTime)}
                      <span className="mx-1 text-border">·</span>
                      Placed {formatDate(bid.placedAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <p className="text-sm font-semibold text-primary tabular-nums">
                      {formatMoney(bid.amount)}
                    </p>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                        bidStatusClass(bid.status),
                      )}
                    >
                      {formatSnakeCase(bid.status)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
