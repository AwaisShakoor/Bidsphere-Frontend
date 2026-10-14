export enum AuctionSort {
  NONE = "none",
  ENDING_SOON = "ending-soon",
  NEWEST = "newest",
  PRICE_HIGH = "price-high",
  PRICE_LOW = "price-low",
  TITLE_AZ = "title-az",
}

export type AuctionSortValue = `${AuctionSort}`;

export const AUCTION_SORT_OPTIONS = [
  { value: AuctionSort.NONE, label: "None" },
  { value: AuctionSort.ENDING_SOON, label: "Ending soon" },
  { value: AuctionSort.NEWEST, label: "Newest first" },
  { value: AuctionSort.PRICE_HIGH, label: "Highest price" },
  { value: AuctionSort.PRICE_LOW, label: "Lowest price" },
  { value: AuctionSort.TITLE_AZ, label: "Title A–Z" },
] as const;

export const DEFAULT_AUCTION_SORT = AuctionSort.NONE;
