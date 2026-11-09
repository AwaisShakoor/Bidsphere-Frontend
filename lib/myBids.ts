import { BidStatus } from "@/enums/bidStatus";
import type { MyBid } from "@/services/types/BidServicesTypes";

export type MyBidFilter = "all" | "active" | "outbid" | "won" | "lost";

function countByStatus(bids: MyBid[], status: BidStatus) {
  return bids.filter((bid) => bid.status.toUpperCase() === status).length;
}

export function getMyBidsView(bids: MyBid[], filter: MyBidFilter) {
  const items = [...bids]
    .sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt))
    .filter(
      (bid) =>
        filter === "all" || bid.status.toUpperCase() === filter.toUpperCase(),
    );

  return {
    items,
    filters: [
      { value: "all" as const, label: "All", count: bids.length },
      {
        value: "active" as const,
        label: "Active",
        count: countByStatus(bids, BidStatus.ACTIVE),
      },
      {
        value: "outbid" as const,
        label: "Outbid",
        count: countByStatus(bids, BidStatus.OUTBID),
      },
      {
        value: "won" as const,
        label: "Won",
        count: countByStatus(bids, BidStatus.WON),
      },
      {
        value: "lost" as const,
        label: "Lost",
        count: countByStatus(bids, BidStatus.LOST),
      },
    ],
  };
}
