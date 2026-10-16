"use client";

import { Pencil, Trash2 } from "lucide-react";

import { AuctionListSkeleton } from "@/components/auction/AuctionListSkeleton";
import { Button } from "@/components/ui/button";
import { useDeleteAuction } from "@/services/hooks/AuctionServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";

type AuctionListProps = {
  auctions: Auction[];
  isLoading?: boolean;
  onOpenAuction: (auction: Auction) => void;
  onEditAuction: (auction: Auction) => void;
};

const AUCTION_LIST_GRID =
  "sm:grid-cols-[minmax(0,1.8fr)_7rem_minmax(8rem,1fr)_minmax(8rem,1fr)_9.5rem]";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function AuctionList({
  auctions,
  isLoading = false,
  onOpenAuction,
  onEditAuction,
}: AuctionListProps) {
  const { mutate: deleteAuction, isPending: isDeleting } = useDeleteAuction();

  function handleDeleteAuction(auction: Auction) {
    const confirmed = window.confirm(
      `Delete "${auction.title || "Untitled"}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    deleteAuction(auction.id);
  }

  if (isLoading) {
    return <AuctionListSkeleton />;
  }

  if (auctions.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
        <p className="text-sm font-medium text-foreground">No auctions yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Create an auction to start managing your listings here.
        </p>
      </section>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
      <div
        className={`hidden gap-3 border-b border-border px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:grid sm:items-center ${AUCTION_LIST_GRID}`}
      >
        <span>Auction</span>
        <span>Status</span>
        <span>Starts</span>
        <span>Ends</span>
        <span className="text-center">Actions</span>
      </div>

      <ul className="divide-y divide-border">
        {auctions.map((auction) => (
          <li
            key={auction.id}
            className={`grid cursor-pointer gap-3 px-4 py-4 transition-colors hover:bg-muted/40 sm:items-center ${AUCTION_LIST_GRID}`}
            onClick={() => onOpenAuction(auction)}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {auction.title || "Untitled"}
              </p>
              <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                {auction.description || "No description"}
              </p>
            </div>

            <div>
              <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {auction.status}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              <span className="mb-0.5 block text-xs uppercase tracking-wide sm:hidden">
                Starts
              </span>
              {formatDate(auction.startTime)}
            </p>

            <p className="text-sm text-muted-foreground">
              <span className="mb-0.5 block text-xs uppercase tracking-wide sm:hidden">
                Ends
              </span>
              {formatDate(auction.endTime)}
            </p>

            <div className="flex items-center justify-end gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                disabled={isDeleting}
                onClick={(event) => {
                  event.stopPropagation();
                  onEditAuction(auction);
                }}
              >
                <Pencil className="size-3.5" />
                <span className="sr-only sm:not-sr-only">Edit</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={isDeleting}
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteAuction(auction);
                }}
              >
                <Trash2 className="size-3.5" />
                <span className="sr-only sm:not-sr-only">Delete</span>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
