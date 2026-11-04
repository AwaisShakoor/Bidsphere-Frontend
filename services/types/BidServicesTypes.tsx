import type { BidStatus } from "@/enums/bidStatus";

export type BidBidder = {
  id: string;
  firstName: string;
  lastName: string;
};

/** Bid on an item (includes bidder) — GET /api/items/:id/bids */
export type Bid = {
  id: string;
  amount: string;
  status: BidStatus;
  placedAt: string;
  bidder: BidBidder;
};

export type BidsResponse = {
  bids: Bid[];
  message?: string;
};

export type MyBidAuction = {
  id: string;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
};

export type MyBidItem = {
  id: string;
  title: string;
  currentBid: string;
  startingPrice: string;
  auction: MyBidAuction;
};

/** Current user's bid (includes item) — GET /api/me/bids */
export type MyBid = {
  id: string;
  amount: string;
  status: BidStatus;
  placedAt: string;
  item: MyBidItem;
};

export type MyBidsResponse = {
  bids: MyBid[];
  message?: string;
};

export type PlaceBidRequest = {
  amount: number;
};

export type PlacedBid = {
  id: string;
  itemId: string;
  bidderId: string;
  amount: string;
  status: BidStatus;
  outbidNotified: boolean;
  ipAddress: string | null;
  placedAt: string;
};

export type PlaceBidResponse = {
  message: string;
  bid: PlacedBid;
};
