"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/components/providers/queryProvider/queryClient";
import { CacheKeys } from "@/enums/cacheKeys";
import {
  getItemPayment,
  getMyPayments,
} from "@/services/Api/PaymentServicesApi";

export function useItemPayment(itemId: string | null, enabled = true) {
  return useQuery({
    queryKey: [CacheKeys.ITEM_PAYMENT, itemId],
    queryFn: () => getItemPayment(itemId!),
    enabled: Boolean(itemId) && enabled,
  });
}

export function useMyPayments(enabled = true) {
  return useQuery({
    queryKey: [CacheKeys.MY_PAYMENTS],
    queryFn: getMyPayments,
    enabled,
  });
}

function invalidatePaymentQueries(itemId?: string | null) {
  queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_PAYMENTS] });
  queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_BIDS] });
  if (itemId) {
    queryClient.invalidateQueries({
      queryKey: [CacheKeys.ITEM_PAYMENT, itemId],
    });
  }
}

export function usePaymentSuccess(itemId: string | null, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    toast.success("Payment successful", { id: "payment-success" });
    invalidatePaymentQueries(itemId);
  }, [enabled, itemId]);
}
