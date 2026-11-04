"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BidStatus } from "@/enums/bidStatus";
import { formatDate, formatMoney, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Bid } from "@/services/types/BidServicesTypes";

export function BidHistoryRows({ bids }: { bids: Bid[] }) {
  const leadingId = bids[0]?.id;

  return (
    <ul className="divide-y divide-border/70">
      {bids.map((bid) => {
        const isLeading = bid.id === leadingId;
        return (
          <li
            key={bid.id}
            className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {bid.bidder.firstName} {bid.bidder.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(bid.placedAt)}
              </p>
            </div>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                bid.status === BidStatus.ACTIVE || isLeading
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {formatSnakeCase(bid.status)}
            </span>
            <p className="text-sm font-semibold text-primary tabular-nums">
              {formatMoney(bid.amount)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

export function BidHistoryDialog({
  open,
  bids,
  onClose,
}: {
  open: boolean;
  bids: Bid[];
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bid-history-dialog-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-card shadow-xl shadow-black/10 ring-1 ring-border sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border/70 px-5 py-4 sm:px-6">
          <div className="min-w-0 space-y-1">
            <h2
              id="bid-history-dialog-title"
              className="text-base font-semibold text-foreground"
            >
              Bid history
            </h2>
            <p className="text-xs text-muted-foreground">
              {bids.length} {bids.length === 1 ? "bid" : "bids"}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close bid history"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
          <BidHistoryRows bids={bids} />
        </div>
      </div>
    </div>
  );
}
