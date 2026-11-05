"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/components/providers/queryProvider/queryClient";
import { CacheKeys } from "@/enums/cacheKeys";
import {
  createItem,
  deleteItem,
  getCategoryItems,
  getItem,
  getItems,
  getPublicItem,
  getPublicItems,
  updateItem,
} from "@/services/Api/ItemServicesApi";
import type {
  CreateItemRequest,
  UpdateItemRequest,
} from "@/services/types/ItemsServicesTypes";

export function useItems(auctionId: string | null) {
  return useQuery({
    queryKey: [CacheKeys.ITEMS, auctionId],
    queryFn: () => getItems(auctionId!),
    enabled: Boolean(auctionId),
  });
}

export function useCategoryItems(slug: string | null) {
  return useQuery({
    queryKey: [CacheKeys.CATEGORY_ITEMS, slug],
    queryFn: () => getCategoryItems(slug!),
    enabled: Boolean(slug),
  });
}

export function useItem(auctionId: string | null, itemId: string | null) {
  return useQuery({
    queryKey: [CacheKeys.ITEM, auctionId, itemId],
    queryFn: () => getItem(auctionId!, itemId!),
    enabled: Boolean(auctionId && itemId),
  });
}

export function usePublicItems() {
  return useQuery({
    queryKey: [CacheKeys.PUBLIC_ITEMS],
    queryFn: getPublicItems,
  });
}

export function usePublicItem(itemId: string | null) {
  return useQuery({
    queryKey: [CacheKeys.PUBLIC_ITEM, itemId],
    queryFn: () => getPublicItem(itemId!),
    enabled: Boolean(itemId),
  });
}

export function useCreateItem() {
  return useMutation({
    mutationFn: ({
      auctionId,
      ...body
    }: CreateItemRequest & { auctionId: string }) =>
      toast.promise(createItem(auctionId, body), {
        loading: "Please wait, creating item…",
        success: (data) => data.message || "Item created successfully!",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to create item",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.ITEMS, data.item.auctionId],
      });
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.CATEGORY_ITEMS],
      });
    },
  });
}

export function useUpdateItem() {
  return useMutation({
    mutationFn: ({
      auctionId,
      itemId,
      ...body
    }: UpdateItemRequest & { auctionId: string; itemId: string }) =>
      updateItem(auctionId, itemId, body),
    onSuccess: (data) => {
      toast.success(data.message || "Item updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.ITEMS, data.item.auctionId],
      });
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.ITEM, data.item.auctionId, data.item.id],
      });
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.CATEGORY_ITEMS],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteItem() {
  return useMutation({
    mutationFn: ({
      auctionId,
      itemId,
    }: {
      auctionId: string;
      itemId: string;
    }) => deleteItem(auctionId, itemId),
    onSuccess: (data, variables) => {
      toast.success(data.message || "Item deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.ITEMS, variables.auctionId],
      });
      queryClient.removeQueries({
        queryKey: [CacheKeys.ITEM, variables.auctionId, variables.itemId],
      });
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.CATEGORY_ITEMS],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
