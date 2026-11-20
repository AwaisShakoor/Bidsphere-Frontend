"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/components/providers/queryProvider/queryClient";
import { CacheKeys } from "@/enums/cacheKeys";
import { getErrorMessage } from "@/services/Api/getErrorMessage";
import {
  confirmItemPayment,
  getItemPayment,
  getMyPayments,
} from "@/services/Api/PaymentServicesApi";
import type { Payment } from "@/services/types/PaymentServicesTypes";

export function useItemPayment(itemId: string | null, enabled = true) {
  return useQuery<Payment | null>({
    queryKey: [CacheKeys.ITEM_PAYMENT, itemId],
    queryFn: () => getItemPayment(itemId!),
    enabled: Boolean(itemId) && enabled,
  });
}

export function useMyPayments(enabled = true) {
  return useQuery<Payment[]>({
    queryKey: [CacheKeys.MY_PAYMENTS],
    queryFn: getMyPayments,
    enabled,
  });
}

function invalidatePaymentQueries(itemId?: string | null) {
  queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_PAYMENTS] });
  queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_BIDS] });
  queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_PAYOUTS] });
  if (itemId) {
    queryClient.invalidateQueries({
      queryKey: [CacheKeys.ITEM_PAYMENT, itemId],
    });
    queryClient.invalidateQueries({
      queryKey: [CacheKeys.PUBLIC_ITEM, itemId],
    });
  }
}

/** On success page: confirm with Stripe (webhook fallback), then refresh payment state. */
export function usePaymentSuccess(itemId: string | null, enabled: boolean) {
  const ranForItem = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (!itemId) {
      toast.success("Payment successful", { id: "payment-success" });
      invalidatePaymentQueries();
      return;
    }

    if (ranForItem.current === itemId) return;
    ranForItem.current = itemId;

    void (async () => {
      try {
        await confirmItemPayment(itemId);
        toast.success("Payment successful", { id: "payment-success" });
      } catch (error) {
        const message = getErrorMessage(error);
        if (message) {
          toast.error(message, { id: "payment-confirm-error" });
        }
      } finally {
        invalidatePaymentQueries(itemId);
      }
    })();
  }, [enabled, itemId]);
}
