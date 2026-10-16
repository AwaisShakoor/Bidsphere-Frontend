import api from "@/lib/api";
import type {
  CreateItemRequest,
  CreateItemResponse,
  GetItemsParams,
  ItemsResponse,
  UpdateItemRequest,
  UpdateItemResponse,
} from "@/services/types/ItemServicesTypes";

export async function createItem(itemData: CreateItemRequest) {
  const { data } = await api.post<CreateItemResponse>("/api/items", itemData);
  return data.item;
}

export async function updateItem(itemId: string, itemData: UpdateItemRequest) {
  const { data } = await api.put<UpdateItemResponse>(
    `/api/items/${itemId}`,
    itemData,
  );
  return data.item;
}

export async function getItems(params?: GetItemsParams) {
  const { data } = await api.get<ItemsResponse>("/api/items", { params });
  return data.items;
}
