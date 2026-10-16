import { AuctionSort, type AuctionSortValue } from "@/enums/auctionSort";
import type { Auction } from "@/services/types/AuctionServicesTypes";

function auctionPrice(auction: Auction) {
  return Number(auction.currentBid ?? auction.startingPrice);
}

export function sortAuctions(
  auctions: Auction[],
  sort: AuctionSortValue,
): Auction[] {
  if (sort === AuctionSort.NONE) {
    return auctions;
  }

  const sorted = [...auctions];

  sorted.sort((a, b) => {
    switch (sort) {
      case AuctionSort.ENDING_SOON:
        return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
      case AuctionSort.NEWEST:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case AuctionSort.PRICE_HIGH:
        return auctionPrice(b) - auctionPrice(a);
      case AuctionSort.PRICE_LOW:
        return auctionPrice(a) - auctionPrice(b);
      case AuctionSort.TITLE_AZ:
        return a.item.title.localeCompare(b.item.title);
      default:
        return 0;
    }
  });

  return sorted;
}
