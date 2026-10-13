"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

import { createItem, getItems, updateItem } from "@/services/Api/itemServicesApi";
import type {
  CreateItemRequest,
  GetItemsParams,
  UpdateItemRequest,
} from "@/services/types/ItemServicesTypes";

export function useItems(params?: GetItemsParams) {
  return useQuery({
    queryKey: ["/api/items", params ?? {}],
    queryFn: () => getItems(params),
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemData: CreateItemRequest) => createItem(itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auctions/me"] });
      toast.success("Item updated successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update item"));
    },
  });
}

function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallbackMessage;
  }

  return fallbackMessage;
}
