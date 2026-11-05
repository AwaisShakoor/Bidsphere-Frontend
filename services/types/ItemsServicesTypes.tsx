import type { ItemCondition } from "@/enums/itemCondition";
import type { ShippingType } from "@/enums/shippingType";
import type { Auction } from "@/services/types/AuctionServicesTypes";
import type { Category } from "@/services/types/CategoryServicesTypes";

export type ItemImage = {
  id: string;
  itemId: string;
  cloudinaryPublicId: string;
  url: string;
  fileSize: number;
  mimeType: string;
  sortOrder: number;
  uploadedAt: string;
};

export type Item = {
  id: string;
  sellerId: string;
  auctionId: string;
  winnerId: string | null;
  startingPrice: string;
  reservePrice: string | null;
  shippingType: ShippingType;
  shippingCost: string | null;
  shippingEstimatedDays: number | null;
  currentBid: string | null;
  categoryId: string;
  title: string;
  description: string;
  itemCondition: ItemCondition;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  images: ItemImage[];
};

export type CreateItemRequest = {
  title: string;
  description: string;
  categoryId: string;
  itemCondition: ItemCondition;
  startingPrice: number;
  reservePrice?: number;
  shippingType: ShippingType;
  shippingCost?: number;
  shippingEstimatedDays?: number;
  images: File[];
};

export type UpdateItemRequest = {
  title: string;
  description: string;
  categoryId: string;
  itemCondition: ItemCondition;
  startingPrice: number;
  reservePrice?: number;
  shippingType: ShippingType;
  shippingCost?: number;
  shippingEstimatedDays?: number;
  images?: File[];
  removeImageIds?: string[];
};

export type CreateItemResponse = {
  message: string;
  item: Item;
};

export type UpdateItemResponse = {
  message: string;
  item: Item;
};

export type DeleteItemResponse = {
  message: string;
  item: Item;
};

export type ItemsResponse = {
  message: string;
  items: Item[];
};

export type CategoryItemsResponse = {
  message: string;
  data?: Item[];
  items?: Item[];
};

export type ItemResponse = {
  message: string;
  item: Item;
};

/** Public marketplace list/detail payload */
export type PublicItem = {
  id: string;
  title: string;
  description: string;
  startingPrice: string;
  reservePrice: string | null;
  currentBid: string | null;
  itemCondition: ItemCondition;
  shippingType: ShippingType;
  shippingCost: string | null;
  shippingEstimatedDays: number | null;
  category: Category;
  images: Pick<ItemImage, "id" | "url">[];
  auction: Pick<Auction, "id" | "title" | "status" | "startTime" | "endTime">;
};

export type PublicItemsResponse = {
  message: string;
  items: PublicItem[];
};

export type PublicItemResponse = {
  message: string;
  item: PublicItem;
};
