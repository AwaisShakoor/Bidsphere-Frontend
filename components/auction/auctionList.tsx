"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { AuctionListSkeleton } from "@/components/auction/auctionListSkeleton";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/ui/confirm-dialog";
import { useDeleteAuction } from "@/services/hooks/AuctionServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";

type AuctionListProps = {
  auctions: Auction[];
  isLoading?: boolean;
  isError?: boolean;
  onEdit: (auction: Auction) => void;
};

const AUCTION_LIST_GRID =
  "sm:grid-cols-[minmax(0,1.6fr)_6.5rem_6.5rem_minmax(8rem,0.9fr)_9.5rem]";

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

export function AuctionList({
  auctions,
  isLoading = false,
  isError = false,
  onEdit,
}: AuctionListProps) {
  const { mutate: deleteAuction, isPending: isDeletingAuction } =
    useDeleteAuction();
  const [auctionToDelete, setAuctionToDelete] = useState<Auction | null>(null);

  function handleConfirmDelete() {
    if (!auctionToDelete) return;

    deleteAuction(auctionToDelete.id, {
      onSuccess: () => {
        setAuctionToDelete(null);
      },
    });
  }

  if (isLoading) {
    return <AuctionListSkeleton />;
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
          Create an auction to start managing your listings here.
        </p>
      </section>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        <div
          className={`hidden gap-3 border-b border-border px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:grid sm:items-center ${AUCTION_LIST_GRID}`}
        >
          <span>Item</span>
          <span>Status</span>
          <span>Price</span>
          <span>Ends</span>
          <span className="text-right">Actions</span>
        </div>

        <ul className="divide-y divide-border">
          {auctions.map((auction) => {
            const price = auction.currentBid ?? auction.startingPrice;

            return (
              <li
                key={auction.id}
                className={`grid gap-3 px-4 py-4 sm:items-center ${AUCTION_LIST_GRID}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {auction.item.title}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                    {auction.item.description}
                  </p>
                </div>

                <div>
                  <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {auction.status}
                  </span>
                </div>

                <p className="text-sm font-medium text-foreground">
                  {formatMoney(price)}
                </p>

                <p className="text-sm text-muted-foreground">
                  {formatDate(auction.endTime)}
                </p>

                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5"
                    disabled={isDeletingAuction}
                    onClick={() => onEdit(auction)}
                  >
                    <Pencil className="size-3.5" />
                    <span className="sr-only sm:not-sr-only">Edit</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={isDeletingAuction}
                    onClick={() => setAuctionToDelete(auction)}
                  >
                    <Trash2 className="size-3.5" />
                    <span className="sr-only sm:not-sr-only">Delete</span>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <DeleteConfirmationDialog
        open={Boolean(auctionToDelete)}
        title="Delete auction"
        text={
          auctionToDelete
            ? `Are you sure you want to delete "${auctionToDelete.item.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        isPending={isDeletingAuction}
        onConfirm={handleConfirmDelete}
        onCancel={() => setAuctionToDelete(null)}
      />
    </>
  );
}
