"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CacheKeys } from "@/enums/cacheKeys";
import { ShippingType } from "@/enums/shippingType";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import type { CreateAuctionFormValues } from "@/lib/validations/auction";
import {
  createAuction,
  deleteAuction,
  getMyAuctions,
  updateAuction,
} from "@/services/Api/AuctionServicesApi";
import { uploadItemImages } from "@/services/Api/ImageServicesApi";
import { createItem, updateItem } from "@/services/Api/ItemServicesApi";
import type {
  CreateAuctionRequest,
  GetMyAuctionsParams,
  UpdateAuctionRequest,
} from "@/services/types/AuctionServicesTypes";

export type CreateAuctionListingInput = CreateAuctionFormValues & {
  images: File[];
};

export function useMyAuctions(
  params?: GetMyAuctionsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [CacheKeys.MY_AUCTIONS, params ?? {}],
    queryFn: () => getMyAuctions(params),
    enabled: options?.enabled ?? true,
  });
}

export function useCreateAuction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (auctionData: CreateAuctionRequest) =>
      createAuction(auctionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_AUCTIONS] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to create auction"));
    },
  });
}

export function useUpdateAuction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      auctionData,
    }: {
      id: string;
      auctionData: UpdateAuctionRequest;
    }) => updateAuction(id, auctionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_AUCTIONS] });
      toast.success("Auction updated successfully!");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Failed to update auction")),
  });
}

export function useDeleteAuction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAuction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_AUCTIONS] });
      toast.success("Auction deleted successfully!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to delete auction")),
  });
}

/** One form submit → POST /items → POST images → POST /auctions */
export function useCreateAuctionListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ images, ...values }: CreateAuctionListingInput) => {
      const item = await createItem({
        title: values.title,
        description: values.description,
        categoryId: values.categoryId,
        itemCondition: values.condition,
      });

      const uploadedImages = await uploadItemImages(item.id, images);

      const auction = await createAuction({
        itemId: item.id,
        startingPrice: values.startingPrice,
        ...(typeof values.reservePrice === "number"
          ? { reservePrice: values.reservePrice }
          : {}),
        shippingType: values.shippingType,
        shippingCost:
          values.shippingType === ShippingType.FLAT_RATE &&
          typeof values.shippingCost === "number"
            ? values.shippingCost
            : 0,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
      });

      return { item, images: uploadedImages, auction };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ITEMS] });
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.ITEM_IMAGES, data.item.id],
      });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_AUCTIONS] });
      toast.success("Auction created successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to create auction"));
    },
  });
}

/** Edit form submit → PUT /items/:itemId then PUT /auctions/:id */
export function useUpdateAuctionListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      auctionId,
      values,
      images = [],
    }: {
      itemId: string;
      auctionId: string;
      values: CreateAuctionFormValues;
      images?: File[];
    }) => {
      const itemData = {
        title: values.title,
        description: values.description,
        categoryId: values.categoryId,
        itemCondition: values.condition,
      };

      const auctionData = {
        startingPrice: values.startingPrice,
        ...(typeof values.reservePrice === "number"
          ? { reservePrice: values.reservePrice }
          : {}),
        shippingType: values.shippingType,
        shippingCost:
          values.shippingType === ShippingType.FLAT_RATE &&
          typeof values.shippingCost === "number"
            ? values.shippingCost
            : 0,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
      };

      const item = await updateItem(itemId, itemData);
      const uploadedImages =
        images.length > 0 ? await uploadItemImages(itemId, images) : [];
      const auction = await updateAuction(auctionId, auctionData);

      return { item, images: uploadedImages, auction };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ITEMS] });
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.ITEM_IMAGES, variables.itemId],
      });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_AUCTIONS] });
      toast.success("Auction updated successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update auction"));
    },
  });
}
