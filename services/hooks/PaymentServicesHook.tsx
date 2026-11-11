"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    toast.success("Payment successful");
    invalidatePaymentQueries(itemId);

    const timer = window.setTimeout(() => {
      router.replace("/my-payments");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [enabled, itemId, router]);
}
