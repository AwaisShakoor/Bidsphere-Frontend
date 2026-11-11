import { BidStatus } from "@/enums/bidStatus";
import type { MyBid } from "@/services/types/BidServicesTypes";

export type MyBidFilter = "all" | "active" | "outbid" | "won" | "lost";

export const MY_BIDS_PAGE_SIZE = 10;

const EMPTY_MESSAGES: Record<MyBidFilter, string> = {
  all: "No bids right now.",
  active: "No active bids right now.",
  outbid: "No outbid auctions right now.",
  won: "No won auctions yet.",
  lost: "No lost auctions yet.",
};

function countByStatus(bids: MyBid[], status: BidStatus) {
  return bids.filter((bid) => bid.status.toUpperCase() === status).length;
}

export function getMyBidsEmptyMessage(filter: MyBidFilter) {
  return EMPTY_MESSAGES[filter];
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
