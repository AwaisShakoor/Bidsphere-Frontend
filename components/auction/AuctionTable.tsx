"use client";

import { useState } from "react";
import {
  AUCTION_TABLE_GRID,
  getAuctionTableColumns,
} from "./auctionTableColumns";
import { DataTable } from "@/components/ui/DataTable";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { useDeleteAuction } from "@/services/hooks/AuctionServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";

type AuctionTableProps = {
  auctions: Auction[];
  isPending?: boolean;
  onOpenAuction: (auction: Auction) => void;
  onEditAuction: (auction: Auction) => void;
};

export function AuctionTable({
  auctions,
  isPending = false,
  onOpenAuction,
  onEditAuction,
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

  return (
    <>
      <DataTable
        columns={columns}
        data={auctions}
        getRowKey={(auction) => auction.id}
        gridClassName={AUCTION_TABLE_GRID}
        isPending={isPending}
        emptyTitle="No auctions yet"
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
