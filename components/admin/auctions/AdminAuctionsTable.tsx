"use client";

import {
  ADMIN_AUCTIONS_TABLE_GRID,
  adminAuctionsTableColumns,
} from "./adminAuctionsTableColumns";
import { DataTable } from "@/components/ui/DataTable";
import { Loader } from "@/components/ui/Loader";
import type { AdminAuction } from "@/services/types/AdminServicesTypes";

type AdminAuctionsTableProps = {
  auctions: AdminAuction[];
  isPending?: boolean;
  isError?: boolean;
  error?: Error | null;
  emptyTitle?: string;
  emptyDescription?: string;
  onOpenAuction?: (auction: AdminAuction) => void;
};

export function AdminAuctionsTable({
  auctions,
  isPending = false,
  isError = false,
  error = null,
  emptyTitle = "No auctions",
  emptyDescription = "Auctions will appear here.",
  onOpenAuction,
}: AdminAuctionsTableProps) {
  if (isPending) {
    return <Loader label="Loading auctions..." />;
  }

  return (
    <DataTable
      columns={adminAuctionsTableColumns}
      data={auctions}
      getRowKey={(auction) => auction.id}
      gridClassName={ADMIN_AUCTIONS_TABLE_GRID}
      isError={isError}
      error={error}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      filterPlaceholder="Search auctions..."
      pagination
      onRowClick={onOpenAuction}
    />
  );
}
