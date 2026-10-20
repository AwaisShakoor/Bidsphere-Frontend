"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/components/providers/queryProvider/queryClient";
import { CacheKeys } from "@/enums/cacheKeys";
import {
  createAuction,
  deleteAuction,
  getAuction,
  getAuctions,
  submitAuction,
  updateAuction,
} from "@/services/Api/AuctionServicesApi";
import type {
  CreateAuctionRequest,
  UpdateAuctionRequest,
} from "@/services/types/AuctionServicesTypes";

export function useAuctions() {
  return useQuery({
    queryKey: [CacheKeys.AUCTIONS],
    queryFn: getAuctions,
  });
}

export function useAuction(id: string | null) {
  return useQuery({
    queryKey: [CacheKeys.AUCTION, id],
    queryFn: () => getAuction(id!),
    enabled: Boolean(id),
  });
}

export function useCreateAuction() {
  return useMutation({
    mutationFn: (body: CreateAuctionRequest) => createAuction(body),
    onSuccess: (data) => {
      toast.success(data.message || "Auction created successfully!");
      queryClient.invalidateQueries({ queryKey: [CacheKeys.AUCTIONS] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateAuction() {
  return useMutation({
    mutationFn: (body: UpdateAuctionRequest) => updateAuction(body),
    onSuccess: (data) => {
      toast.success(data.message || "Auction updated successfully!");
      queryClient.invalidateQueries({ queryKey: [CacheKeys.AUCTIONS] });
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.AUCTION, data.auction.id],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteAuction() {
  return useMutation({
    mutationFn: (id: string) => deleteAuction(id),
    onSuccess: (data, id) => {
      toast.success(data.message || "Auction deleted successfully!");
      queryClient.invalidateQueries({ queryKey: [CacheKeys.AUCTIONS] });
      queryClient.removeQueries({ queryKey: [CacheKeys.AUCTION, id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useSubmitAuction() {
  return useMutation({
    mutationFn: (id: string) => submitAuction(id),
    onSuccess: (data) => {
      toast.success(data.message || "Auction submitted for approval!");
      queryClient.invalidateQueries({ queryKey: [CacheKeys.AUCTIONS] });
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.AUCTION, data.auction.id],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
