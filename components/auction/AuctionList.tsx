"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { AuctionListSkeleton } from "@/components/auction/AuctionListSkeleton";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { formatDate } from "@/lib/format";
import { useDeleteAuction } from "@/services/hooks/AuctionServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";

type AuctionListProps = {
  auctions: Auction[];
  isPending?: boolean;
  onOpenAuction: (auction: Auction) => void;
  onEditAuction: (auction: Auction) => void;
};

const AUCTION_LIST_GRID =
  "sm:grid-cols-[minmax(0,1.8fr)_7rem_minmax(8rem,1fr)_minmax(8rem,1fr)_5.5rem]";

export function AuctionList({
  auctions,
  isPending = false,
  onOpenAuction,
  onEditAuction,
}: AuctionListProps) {
  const { mutate: deleteAuction, isPending: isDeleting } = useDeleteAuction();
  const [auctionToDelete, setAuctionToDelete] = useState<Auction | null>(null);

  function handleConfirmDelete() {
    if (!auctionToDelete) return;
    deleteAuction(auctionToDelete.id, {
      onSuccess: () => setAuctionToDelete(null),
    });
  }

  if (isPending) {
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
    <>
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

              <div className="flex items-center justify-end gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-primary hover:bg-primary/10 hover:text-primary"
                  title="Edit auction"
                  disabled={isDeleting}
                  onClick={(event) => {
                    event.stopPropagation();
                    onEditAuction(auction);
                  }}
                >
                  <Pencil className="size-4" />
                  <span className="sr-only">Edit auction</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  title="Delete auction"
                  disabled={isDeleting}
                  onClick={(event) => {
                    event.stopPropagation();
                    setAuctionToDelete(auction);
                  }}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Delete auction</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <DeleteConfirmationDialog
        open={Boolean(auctionToDelete)}
        name={auctionToDelete?.title ?? ""}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!isDeleting) setAuctionToDelete(null);
        }}
      />
    </>
  );
}
