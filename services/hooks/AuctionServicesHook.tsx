"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

import { ShippingType } from "@/enums/shippingType";
import type { CreateAuctionFormValues } from "@/lib/validations/auction";
import {
  createAuction,
  deleteAuction,
  getMyAuctions,
  updateAuction,
} from "@/services/Api/auctionServicesApi";
import { createItem, updateItem } from "@/services/Api/itemServicesApi";
import type {
  CreateAuctionRequest,
  GetMyAuctionsParams,
  UpdateAuctionRequest,
} from "@/services/types/AuctionServicesTypes";

export function useMyAuctions(
  params?: GetMyAuctionsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["/api/auctions/me", params ?? {}],
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
      queryClient.invalidateQueries({ queryKey: ["/api/auctions/me"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/auctions/me"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/auctions/me"] });
      toast.success("Auction deleted successfully!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Failed to delete auction")),
  });
}

/** One form submit → POST /items then POST /auctions */
export function useCreateAuctionListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateAuctionFormValues) => {
      const item = await createItem({
        title: values.title,
        description: values.description,
        categoryId: values.categoryId,
        itemCondition: values.condition,
      });

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

      return { item, auction };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auctions/me"] });
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
    }: {
      itemId: string;
      auctionId: string;
      values: CreateAuctionFormValues;
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
      const auction = await updateAuction(auctionId, auctionData);

      return { item, auction };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auctions/me"] });
      toast.success("Auction updated successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update auction"));
    },
  });
}

function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallbackMessage;
  }

  return fallbackMessage;
}
