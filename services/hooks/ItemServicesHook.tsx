"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CacheKeys } from "@/enums/cacheKeys";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { createItem, getItems, updateItem } from "@/services/Api/ItemServicesApi";
import type {
  CreateItemRequest,
  GetItemsParams,
  UpdateItemRequest,
} from "@/services/types/ItemServicesTypes";

export function useItems(params?: GetItemsParams) {
  return useQuery({
    queryKey: [CacheKeys.ITEMS, params ?? {}],
    queryFn: () => getItems(params),
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemData: CreateItemRequest) => createItem(itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ITEMS] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to create item"));
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      itemData,
    }: {
      itemId: string;
      itemData: UpdateItemRequest;
    }) => updateItem(itemId, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ITEMS] });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_AUCTIONS] });
      toast.success("Item updated successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update item"));
    },
  });
}
