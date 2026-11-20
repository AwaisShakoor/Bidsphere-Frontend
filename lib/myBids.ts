import { BidStatus } from "@/enums/bidStatus";
import { isWithinDateRange, type DateRangePreset } from "@/lib/dateRange";
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

export function getMyBidsView(
  bids: MyBid[],
  filter: MyBidFilter,
  dateRange: DateRangePreset = "all",
) {
  const byDate = bids.filter((bid) =>
    isWithinDateRange(bid.placedAt, dateRange),
  );

  const items = [...byDate]
    .sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt))
    .filter(
      (bid) =>
        filter === "all" || bid.status.toUpperCase() === filter.toUpperCase(),
    );

  return {
    items,
    filters: [
      { value: "all" as const, label: "All", count: byDate.length },
      {
        value: "active" as const,
        label: "Active",
        count: countByStatus(byDate, BidStatus.ACTIVE),
      },
      {
        value: "outbid" as const,
        label: "Outbid",
        count: countByStatus(byDate, BidStatus.OUTBID),
      },
      {
        value: "won" as const,
        label: "Won",
        count: countByStatus(byDate, BidStatus.WON),
      },
      {
        value: "lost" as const,
        label: "Lost",
        count: countByStatus(byDate, BidStatus.LOST),
      },
    ],
  };
}
