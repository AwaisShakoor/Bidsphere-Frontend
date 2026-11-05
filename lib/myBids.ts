import { BidStatus } from "@/enums/bidStatus";
import type { MyBid } from "@/services/types/BidServicesTypes";

export type MyBidFilter = "all" | "active" | "outbid";

export function getMyBidsView(bids: MyBid[], filter: MyBidFilter) {
  const items = [...bids]
    .sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt))
    .filter(
      (bid) =>
        filter === "all" || bid.status.toUpperCase() === filter.toUpperCase(),
    );

  const activeCount = bids.filter(
    (bid) => bid.status.toUpperCase() === BidStatus.ACTIVE,
  ).length;

  return {
    items,
    filters: [
      { value: "all" as const, label: "All", count: bids.length },
      { value: "active" as const, label: "Active", count: activeCount },
      { value: "outbid" as const, label: "Outbid", count: bids.length - activeCount },
    ],
  };
}
