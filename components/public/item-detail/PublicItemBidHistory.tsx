"use client";

import { useState } from "react";
import { Gavel } from "lucide-react";
import { BidHistoryDialog, BidHistoryRows } from "./BidHistoryDialog";
import { PublicItemBidHistorySkeleton } from "./PublicItemBidHistorySkeleton";
import { Button } from "@/components/ui/button";
import { BidStatus } from "@/enums/bidStatus";
import { formatMoney } from "@/lib/format";
import { useItemBids } from "@/services/hooks/BidServicesHook";

export function PublicItemBidHistory({ itemId }: { itemId: string }) {
  const { data: bids = [], isPending, isError, error } = useItemBids(itemId);
  const [open, setOpen] = useState(false);
  const leadingBid =
    bids.find((bid) => bid.status === BidStatus.ACTIVE) ?? bids[0];

  if (isPending) {
    return <PublicItemBidHistorySkeleton />;
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <Gavel className="size-4 text-primary" aria-hidden />
            <h2 className="text-base font-semibold text-foreground">
              Bid activity
            </h2>
            {!isError && bids.length > 0 ? (
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                · {bids.length}
              </span>
            ) : null}
          </div>
          {!isError && bids.length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs font-semibold text-primary hover:text-primary"
              onClick={() => setOpen(true)}
            >
              View all
            </Button>
          ) : null}
        </div>

        <div className="px-4 py-3 sm:px-5">
          {isError ? (
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : "Could not load bids."}
            </p>
          ) : bids.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No bids yet. Be the first to place one.
            </p>
          ) : (
            <div className="space-y-3">
              {leadingBid ? (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                      High bid
                    </p>
                    <p className="truncate text-sm font-medium text-foreground">
                      {leadingBid.bidder.firstName} {leadingBid.bidder.lastName}
                    </p>
                  </div>
                  <p className="shrink-0 text-lg font-bold text-primary tabular-nums">
                    {formatMoney(leadingBid.amount)}
                  </p>
                </div>
              ) : null}

              <div>
                <p className="mb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Recent
                </p>
                <BidHistoryRows bids={bids.slice(0, 3)} />
              </div>

              {bids.length > 3 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setOpen(true)}
                >
                  View full history ({bids.length})
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <BidHistoryDialog
        open={open}
        bids={bids}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
