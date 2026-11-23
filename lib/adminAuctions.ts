import { AuctionStatus } from "@/enums/auctionStatus";
import type { AdminAuction } from "@/services/types/AdminServicesTypes";

export type AdminAuctionTab = "pending" | "active" | "rejected" | "completed";

export const ADMIN_AUCTION_TABS: {
  value: AdminAuctionTab;
  label: string;
  empty: string;
}[] = [
  { value: "pending", label: "Pending", empty: "No pending auctions." },
  { value: "active", label: "Active", empty: "No active auctions." },
  { value: "rejected", label: "Rejected", empty: "No rejected auctions." },
  { value: "completed", label: "Completed", empty: "No completed auctions." },
];

const TAB_STATUSES: Record<AdminAuctionTab, AuctionStatus[]> = {
  pending: [AuctionStatus.PENDING_APPROVAL],
  active: [AuctionStatus.SCHEDULED, AuctionStatus.LIVE],
  rejected: [AuctionStatus.REJECTED],
  completed: [
    AuctionStatus.ENDED,
    AuctionStatus.COMPLETED,
    AuctionStatus.NO_SALE,
    AuctionStatus.CANCELLED,
  ],
};

export function parseAdminAuctionTab(value: string | null): AdminAuctionTab {
  return ADMIN_AUCTION_TABS.some((tab) => tab.value === value)
    ? (value as AdminAuctionTab)
    : "pending";
}

export function getAuctionsByTab(
  auctions: AdminAuction[],
  tab: AdminAuctionTab,
) {
  return auctions.filter((auction) =>
    TAB_STATUSES[tab].includes(auction.status.toUpperCase() as AuctionStatus),
  );
}

export function getAdminAuctionTabEmptyMessage(tab: AdminAuctionTab) {
  return (
    ADMIN_AUCTION_TABS.find((item) => item.value === tab)?.empty ??
    "No auctions."
  );
}

export function getAdminAuctionsHref(
  tab: AdminAuctionTab = "pending",
  auctionId?: string,
) {
  const params = new URLSearchParams();
  if (auctionId) params.set("id", auctionId);
  if (tab !== "pending") params.set("tab", tab);
  const query = params.toString();
  return query ? `/admin/auctions?${query}` : "/admin/auctions";
}
