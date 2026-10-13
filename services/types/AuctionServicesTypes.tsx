import type { ItemCondition } from "@/enums/itemCondition";
import type { ShippingType } from "@/enums/shippingType";

export type AuctionItem = {
  id: string;
  title: string;
  description: string;
  itemCondition: ItemCondition;
  categoryId: string;
};

export type Auction = {
  id: string;
  itemId: string;
  startingPrice: string;
  reservePrice: string | null;
  currentBid: string | null;
  shippingType: ShippingType;
  shippingCost: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  item: AuctionItem;
};

export type CreateAuctionRequest = {
  itemId: string;
  startingPrice: number;
  reservePrice?: number;
  shippingType: ShippingType;
  shippingCost: number;
  startTime: string;
  endTime: string;
};

export type UpdateAuctionRequest = {
  startingPrice?: number;
  reservePrice?: number;
  shippingType?: ShippingType;
  shippingCost?: number;
  startTime?: string;
  endTime?: string;
}

export type CreateAuctionResponse = {
  message: string;
  auction: Auction;
};

export type UpdateAuctionResponse = {
  message: string;
  auction: Auction;
};

export type DeleteAuctionResponse = {
  message: string;
};

export type AuctionsResponse = {
  message: string;
  auctions: Auction[];
};

export type GetMyAuctionsParams = {
  categoryId: string;
};
