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
      <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/10 ring-1 ring-primary/20">
        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Gavel className="size-4 text-primary" aria-hidden />
            <h2 className="text-base font-semibold text-foreground">
              Bid activity
            </h2>
          </div>
          {!isError && bids.length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs font-semibold text-primary hover:text-primary"
              onClick={() => setOpen(true)}
            >
              View all ({bids.length})
            </Button>
          ) : null}
        </div>

        <div className="px-5 py-4 sm:px-6">
          {isError ? (
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : "Could not load bids."}
            </p>
          ) : bids.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No bids yet. Be the first to place one.
            </p>
          ) : (
            <div className="space-y-4">
              {leadingBid ? (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-3">
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                      Current high bid
                    </p>
                    <p className="truncate text-sm font-medium text-foreground">
                      {leadingBid.bidder.firstName} {leadingBid.bidder.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bids.length} {bids.length === 1 ? "bid" : "bids"}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-primary tabular-nums">
                    {formatMoney(leadingBid.amount)}
                  </p>
                </div>
              ) : null}

              <div>
                <p className="mb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Recent bids
                </p>
                <BidHistoryRows bids={bids.slice(0, 3)} />
              </div>

              {bids.length > 3 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setOpen(true)}
                >
                  View full bid history
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
