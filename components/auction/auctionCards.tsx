"use client";

import { ImageIcon } from "lucide-react";
import { AuctionCardsSkeleton } from "@/components/auction/auctionCardsSkeleton";
import type { Auction } from "@/services/types/AuctionServicesTypes";

type AuctionCardsProps = {
  auctions: Auction[];
  isLoading?: boolean;
  isError?: boolean;
};

function formatMoney(value: string | null) {
  const amount = Number(value);
  if (Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function AuctionCards({
  auctions,
  isLoading = false,
  isError = false,
}: AuctionCardsProps) {
  if (isLoading) {
    return <AuctionCardsSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Could not load your auctions. Try again later.
      </p>
    );
  }

  if (auctions.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
        <p className="text-sm font-medium text-foreground">No auctions yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Create an auction from My auctions and it will show up here as a card.
        </p>
      </section>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => {
        const price = auction.currentBid ?? auction.startingPrice;
        const coverImage = auction.item.images?.[0];

        return (
          <li
            key={auction.id}
            className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border"
          >
            <div className="relative aspect-video bg-muted">
              {coverImage ? (
                <img
                  src={coverImage.url}
                  alt={auction.item.title}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-8" aria-hidden />
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold tracking-tight text-foreground">
                  {auction.item.title}
                </p>
                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {auction.status}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {auction.item.description}
              </p>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {auction.currentBid ? "Current bid" : "Starting at"}
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {formatMoney(price)}
                  </p>
                </div>
                <p className="text-right text-xs text-muted-foreground">
                  Ends
                  <br />
                  {formatDate(auction.endTime)}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
