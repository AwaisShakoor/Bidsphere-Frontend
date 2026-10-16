import {
  AuctionStatus,
  type AuctionStatusValue,
} from "@/enums/auctionStatus";
import type { Auction } from "@/services/types/AuctionServicesTypes";

export function filterAuctionsByTitle(
  auctions: Auction[],
  query: string,
): Auction[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return auctions;

  return auctions.filter((auction) =>
    auction.item.title.toLowerCase().includes(normalized),
  );
}

export function filterAuctionsByStatus(
  auctions: Auction[],
  status: AuctionStatusValue,
): Auction[] {
  if (status === AuctionStatus.ALL) return auctions;

  return auctions.filter(
    (auction) => auction.status.toUpperCase() === status,
  );
}
