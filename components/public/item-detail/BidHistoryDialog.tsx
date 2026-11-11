"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BidStatus, getBidStatusClass } from "@/enums/bidStatus";
import { useModalLock } from "@/hooks/useModalLock";
import { formatDate, formatMoney, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Bid } from "@/services/types/BidServicesTypes";

export function BidHistoryRows({ bids }: { bids: Bid[] }) {
  return (
    <ul className="divide-y divide-border/70">
      {bids.map((bid) => {
        const status = bid.status.toUpperCase();
        const isActive = status === BidStatus.ACTIVE;
        const isWon = status === BidStatus.WON;

        return (
          <li
            key={bid.id}
            className={cn(
              "flex items-center gap-3 px-1 py-2.5",
              isActive && "rounded-lg bg-primary/5",
              isWon &&
                "rounded-lg bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/20",
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className="truncate text-sm font-medium text-foreground">
                  {bid.bidder.firstName} {bid.bidder.lastName}
                </p>
                <span
                  className={cn(
                    "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                    getBidStatusClass(bid.status),
                  )}
                >
                  {formatSnakeCase(bid.status)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDate(bid.placedAt)}
              </p>
            </div>
            <p
              className={cn(
                "shrink-0 text-sm font-semibold tabular-nums",
                isWon
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-primary",
              )}
            >
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
  useModalLock({ open, onClose });

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
          <div className="min-w-0 space-y-0.5">
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

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-5">
          <BidHistoryRows bids={bids} />
        </div>
      </div>
    </div>
  );
}
