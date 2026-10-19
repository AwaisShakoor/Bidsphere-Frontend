import api from "@/services/api";
import { getErrorMessage } from "@/services/Api/getErrorMessage";
import type {
  CategoryItemsResponse,
  CreateItemRequest,
  CreateItemResponse,
  DeleteItemResponse,
  Item,
  ItemResponse,
  ItemsResponse,
  UpdateItemRequest,
  UpdateItemResponse,
} from "@/services/types/ItemsServicesTypes";

export async function getItems(auctionId: string) {
  try {
    const { data } = await api.get<ItemsResponse>(`/api/${auctionId}/items`);
    return data.items;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load items");
  }
}

export async function getCategoryItems(slug: string): Promise<Item[]> {
  try {
    const { data } = await api.get<CategoryItemsResponse>(
      `/api/category/${slug}/items`,
    );
    return data.data ?? data.items ?? [];
  } catch (error) {
    throw new Error(
      getErrorMessage(error) || "Failed to load category items",
    );
  }
}

export async function getItem(auctionId: string, itemId: string) {
  try {
    const { data } = await api.get<ItemResponse>(
      `/api/${auctionId}/items/${itemId}`,
    );
    return data.item;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load item");
  }
}

function appendItemFields(
  formData: FormData,
  body: CreateItemRequest | UpdateItemRequest,
) {
  formData.append("title", body.title);
  formData.append("description", body.description);
  formData.append("categoryId", body.categoryId);
  formData.append("itemCondition", body.itemCondition);
  formData.append("startingPrice", String(body.startingPrice));
  formData.append("shippingType", body.shippingType);

  if (body.reservePrice != null) {
    formData.append("reservePrice", String(body.reservePrice));
  }
  if (body.shippingCost != null) {
    formData.append("shippingCost", String(body.shippingCost));
  }
}

export async function createItem(auctionId: string, body: CreateItemRequest) {
  try {
    const formData = new FormData();
    appendItemFields(formData, body);
    body.images.forEach((file) => {
      formData.append("images", file);
    });

    const { data } = await api.post<CreateItemResponse>(
      `/api/${auctionId}/items`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to create item");
  }
}

export async function updateItem(
  auctionId: string,
  itemId: string,
  body: UpdateItemRequest,
) {
  try {
    const formData = new FormData();
    appendItemFields(formData, body);
    body.images?.forEach((file) => {
      formData.append("images", file);
    });
    body.removeImageIds?.forEach((id) => {
      formData.append("removeImageIds", id);
    });

    const { data } = await api.put<UpdateItemResponse>(
      `/api/${auctionId}/items/${itemId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to update item");
  }
}

export async function deleteItem(auctionId: string, itemId: string) {
  try {
    const { data } = await api.delete<DeleteItemResponse>(
      `/api/${auctionId}/items/${itemId}`,
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to delete item");
  }
}
