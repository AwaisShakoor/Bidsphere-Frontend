"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  AUCTION_TABLE_GRID,
  getAuctionTableColumns,
} from "./auctionTableColumns";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { Loader } from "@/components/ui/Loader";
import { useDeleteAuction } from "@/services/hooks/AuctionServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";

type AuctionTableProps = {
  auctions: Auction[];
  isPending?: boolean;
  isError?: boolean;
  error?: Error | null;
  onOpenAuction: (auction: Auction) => void;
  onEditAuction: (auction: Auction) => void;
  onCreateAuction?: () => void;
};

export function AuctionTable({
  auctions,
  isPending = false,
  isError = false,
  error = null,
  onOpenAuction,
  onEditAuction,
  onCreateAuction,
}: AuctionTableProps) {
  const { mutate: deleteAuction, isPending: isDeleting } = useDeleteAuction();
  const [auctionToDelete, setAuctionToDelete] = useState<Auction | null>(null);

  function handleConfirmDelete() {
    if (!auctionToDelete) return;
    deleteAuction(auctionToDelete.id, {
      onSuccess: () => setAuctionToDelete(null),
    });
  }

  const columns = getAuctionTableColumns({
    isDeleting,
    onEditAuction,
    onDeleteAuction: setAuctionToDelete,
  });

  if (isPending) {
    return <Loader label="Loading my auctions..." />;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={auctions}
        getRowKey={(auction) => auction.id}
        gridClassName={AUCTION_TABLE_GRID}
        isError={isError}
        error={error}
        emptyTitle="No auctions yet"
        emptyDescription="Create your first auction to list items, set a schedule, and submit it for approval."
        emptyAction={
          onCreateAuction ? (
            <Button
              type="button"
              className="h-10 gap-1.5"
              onClick={onCreateAuction}
            >
              <Plus data-icon="inline-start" />
              Create auction
            </Button>
          ) : null
        }
        filterPlaceholder="Search auctions..."
        onRowClick={onOpenAuction}
      />

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
