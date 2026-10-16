import type { ItemCondition } from "@/enums/itemCondition";

export type Item = {
  id: string;
  title: string;
  description: string;
  itemCondition: ItemCondition;
  categoryId: string;
  sellerId: string;
  createdAt: string;
};

export type CreateItemRequest = {
  title: string;
  description: string;
  categoryId: string;
  itemCondition: ItemCondition;
};

export type CreateItemResponse = {
  Message: string;
  item: Item;
};

export type UpdateItemRequest = {
  title?: string;
  description?: string;
  categoryId?: string;
  itemCondition?: ItemCondition;
};

export type UpdateItemResponse = {
  Message: string;
  item: Item;
};

export type ItemsResponse = {
  Message: string;
  items: Item[];
};

export type GetItemsParams = {
  categoryId?: string;
};
