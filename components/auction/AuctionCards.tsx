"use client";

import { Pencil } from "lucide-react";
import { AuctionCardsSkeleton } from "@/components/auction/AuctionCardsSkeleton";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { Auction } from "@/services/types/AuctionServicesTypes";

type AuctionCardsProps = {
  auctions: Auction[];
  isPending?: boolean;
  onEditAuction: (auction: Auction) => void;
};

export function AuctionCards({
  auctions,
  isPending = false,
  onEditAuction,
}: AuctionCardsProps) {
  if (isPending) {
    return <AuctionCardsSkeleton />;
  }

  if (auctions.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
        <p className="text-sm font-medium text-foreground">No auctions yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Create an auction and it will show up here.
        </p>
      </section>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <li
          key={auction.id}
          className="overflow-hidden rounded-2xl bg-card p-4 shadow-md shadow-primary/5 ring-1 ring-border"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold tracking-tight text-foreground">
              {auction.title || "Untitled"}
            </p>
            <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {auction.status}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {auction.description || "No description"}
          </p>
          <div className="mt-4 flex items-end justify-between gap-3 text-xs text-muted-foreground">
            <div>
              <p>Starts</p>
              <p className="mt-0.5 font-medium text-foreground">
                {formatDate(auction.startTime)}
              </p>
            </div>
            <div className="text-right">
              <p>Ends</p>
              <p className="mt-0.5 font-medium text-foreground">
                {formatDate(auction.endTime)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => onEditAuction(auction)}
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
