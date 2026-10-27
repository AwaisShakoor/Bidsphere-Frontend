"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/components/providers/queryProvider/queryClient";
import { CacheKeys } from "@/enums/cacheKeys";
import {
  approveAdminAuction,
  getAdminAuction,
  getAdminAuctions,
  getAdminUsers,
  rejectAdminAuction,
} from "@/services/Api/AdminServicesApi";

export function useAdminUsers() {
  return useQuery({
    queryKey: [CacheKeys.ADMIN_USERS],
    queryFn: getAdminUsers,
  });
}

export function useAdminAuctions() {
  return useQuery({
    queryKey: [CacheKeys.ADMIN_AUCTIONS],
    queryFn: getAdminAuctions,
  });
}

export function useAdminAuction(id: string | null) {
  return useQuery({
    queryKey: [CacheKeys.ADMIN_AUCTION, id],
    queryFn: () => getAdminAuction(id!),
    enabled: Boolean(id),
  });
}

export function useApproveAdminAuction() {
  return useMutation({
    mutationFn: (id: string) => approveAdminAuction(id),
    onSuccess: (data, id) => {
      toast.success(data.message || "Auction approved successfully!");
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ADMIN_AUCTIONS] });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ADMIN_AUCTION, id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useRejectAdminAuction() {
  return useMutation({
    mutationFn: ({
      id,
      rejectionReason,
    }: {
      id: string;
      rejectionReason: string;
    }) => rejectAdminAuction(id, rejectionReason),
    onSuccess: (data, { id }) => {
      toast.success(data.message || "Auction rejected successfully!");
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ADMIN_AUCTIONS] });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ADMIN_AUCTION, id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
