"use client";

import { AdminAuctionsTable } from "./AdminAuctionsTable";
import { AuctionStatus } from "@/enums/auctionStatus";
import { useAdminAuctions } from "@/services/hooks/AdminServicesHook";

export function AdminAuctionsPage() {
  const { data = [], isPending, isError, error } = useAdminAuctions();

  const auctions = data.filter(
    (auction) => auction.status === AuctionStatus.PENDING_APPROVAL,
  );

  return (
    <AdminAuctionsTable
      auctions={auctions}
      isPending={isPending}
      isError={isError}
      error={error}
    />
  );
}

export { AdminAuctionsTable } from "./AdminAuctionsTable";
