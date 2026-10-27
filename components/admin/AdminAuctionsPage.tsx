"use client";

import { AuctionStatus } from "@/enums/auctionStatus";
import {
  getAuctionStatusClass,
  getAuctionStatusLabel,
} from "@/lib/constants/auctionStatus";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAdminAuctions } from "@/services/hooks/AdminServicesHook";

const GRID =
  "sm:grid-cols-[minmax(0,1.5fr)_minmax(9rem,1fr)_7.5rem_4.5rem_minmax(8rem,1fr)]";

export function AdminAuctionsPage() {
  const { data = [], isPending, isError, error } = useAdminAuctions();

  const auctions = data.filter(
    (auction) => auction.status === AuctionStatus.PENDING_APPROVAL,
  );

  if (isPending) {
    return (
      <div className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border-b border-border px-4 py-4 last:border-b-0"
          >
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-1/4 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {error?.message || "Could not load auctions."}
      </p>
    );
  }

  if (auctions.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
        <p className="text-sm font-medium text-foreground">
          No pending auctions
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Auctions waiting for approval will appear here.
        </p>
      </section>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
      <div
        className={`hidden gap-3 border-b border-border px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:grid sm:items-center ${GRID}`}
      >
        <span>Auction</span>
        <span>Seller</span>
        <span>Status</span>
        <span>Items</span>
        <span>Created</span>
      </div>

      <ul className="divide-y divide-border">
        {auctions.map((auction) => {
          const thumb = auction.items[0]?.images[0]?.url;

          return (
            <li
              key={auction.id}
              className={`grid gap-3 px-4 py-4 sm:items-center ${GRID}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-border"
                  />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                    —
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {auction.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground sm:hidden">
                    {auction.seller.firstName} {auction.seller.lastName}
                  </p>
                </div>
              </div>

              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm text-foreground">
                  {auction.seller.firstName} {auction.seller.lastName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {auction.seller.email}
                </p>
              </div>

              <div>
                <span
                  className={cn(
                    "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                    getAuctionStatusClass(auction.status),
                  )}
                >
                  {getAuctionStatusLabel(auction.status)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                <span className="mb-0.5 block text-xs tracking-wide text-muted-foreground uppercase sm:hidden">
                  Items
                </span>
                {auction.items.length}
              </p>

              <p className="text-sm text-muted-foreground">
                <span className="mb-0.5 block text-xs tracking-wide text-muted-foreground uppercase sm:hidden">
                  Created
                </span>
                {formatDate(auction.createdAt)}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
