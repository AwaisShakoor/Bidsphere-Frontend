"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CacheKeys } from "@/enums/cacheKeys";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import {
  deleteItemImage,
  getItemImages,
  uploadItemImages,
} from "@/services/Api/ImageServicesApi";

export function useItemImages(
  itemId?: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [CacheKeys.ITEM_IMAGES, itemId],
    queryFn: () => getItemImages(itemId!),
    enabled: (options?.enabled ?? true) && Boolean(itemId),
  });
}

export function useUploadItemImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      files,
    }: {
      itemId: string;
      files: File[];
    }) => uploadItemImages(itemId, files),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.ITEM_IMAGES, variables.itemId],
      });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ITEMS] });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_AUCTIONS] });
      toast.success("Images uploaded successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to upload images"));
    },
  });
}

export function useDeleteItemImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      imageId,
    }: {
      itemId: string;
      imageId: string;
    }) => deleteItemImage(itemId, imageId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.ITEM_IMAGES, variables.itemId],
      });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ITEMS] });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_AUCTIONS] });
      toast.success("Image deleted successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to delete image"));
    },
  });
}
