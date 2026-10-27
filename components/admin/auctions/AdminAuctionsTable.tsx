"use client";

import {
  ADMIN_AUCTIONS_TABLE_GRID,
  adminAuctionsTableColumns,
} from "./adminAuctionsTableColumns";
import { DataTable } from "@/components/ui/DataTable";
import type { AdminAuction } from "@/services/types/AdminServicesTypes";

type AdminAuctionsTableProps = {
  auctions: AdminAuction[];
  isPending?: boolean;
  isError?: boolean;
  error?: Error | null;
};

export function AdminAuctionsTable({
  auctions,
  isPending = false,
  isError = false,
  error = null,
}: AdminAuctionsTableProps) {
  return (
    <DataTable
      columns={adminAuctionsTableColumns}
      data={auctions}
      getRowKey={(auction) => auction.id}
      gridClassName={ADMIN_AUCTIONS_TABLE_GRID}
      isPending={isPending}
      isError={isError}
      error={error}
      emptyTitle="No pending auctions"
      filterPlaceholder="Search auctions..."
    />
  );
}
