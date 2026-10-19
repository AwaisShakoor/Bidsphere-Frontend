import type { ItemCondition } from "@/enums/itemCondition";
import type { ShippingType } from "@/enums/shippingType";

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

export type ItemResponse = {
  message: string;
  item: Item;
};
