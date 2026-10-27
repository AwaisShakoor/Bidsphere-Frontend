"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AdminAuctionDetail } from "./AdminAuctionDetail";
import { AdminAuctionsTable } from "./AdminAuctionsTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useAdminAuctions } from "@/services/hooks/AdminServicesHook";
import type { AdminAuction } from "@/services/types/AdminServicesTypes";

export function AdminAuctionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auctionId = searchParams.get("id");

  const { data: auctions = [], isPending, isError, error } = useAdminAuctions();

  function handleOpenAuction(auction: AdminAuction) {
    router.push(`/admin/auctions?id=${auction.id}`);
  }

  function handleBack() {
    router.push("/admin/auctions");
  }

  if (auctionId) {
    return <AdminAuctionDetail auctionId={auctionId} onBack={handleBack} />;
  }

  return (
    <>
      <AdminPageHeader
        title="Pending auctions"
        description="Review seller submissions waiting for approval."
      />
      <AdminAuctionsTable
        auctions={auctions}
        isPending={isPending}
        isError={isError}
        error={error}
        onOpenAuction={handleOpenAuction}
      />
    </>
  );
}

export { AdminAuctionsTable } from "./AdminAuctionsTable";
export { AdminAuctionDetail } from "./AdminAuctionDetail";
