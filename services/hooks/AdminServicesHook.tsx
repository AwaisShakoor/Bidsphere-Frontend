"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/components/providers/queryProvider/queryClient";
import { CacheKeys } from "@/enums/cacheKeys";
import {
  approveAdminAuction,
  getAdminAuction,
  getAdminAuctions,
  getAdminOverview,
  getAdminPayments,
  getAdminUsers,
  refundAdminPayment,
  rejectAdminAuction,
} from "@/services/Api/AdminServicesApi";
import type { AdminPayment } from "@/services/types/AdminServicesTypes";

export function useAdminOverview() {
  return useQuery({
    queryKey: [CacheKeys.ADMIN_OVERVIEW],
    queryFn: getAdminOverview,
  });
}

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
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.ADMIN_AUCTION, id],
      });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ADMIN_OVERVIEW] });
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
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.ADMIN_AUCTION, id],
      });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ADMIN_OVERVIEW] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useAdminPayments() {
  return useQuery<AdminPayment[]>({
    queryKey: [CacheKeys.ADMIN_PAYMENTS],
    queryFn: getAdminPayments,
  });
}

export function useRefundAdminPayment() {
  return useMutation({
    mutationFn: (itemId: string) => refundAdminPayment(itemId),
    onSuccess: (data) => {
      toast.success(data.message || "Payment refunded successfully");
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ADMIN_PAYMENTS] });
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.ITEM_PAYMENT, data.data.itemId],
      });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_PAYMENTS] });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_PAYOUTS] });
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.PUBLIC_ITEM, data.data.itemId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
