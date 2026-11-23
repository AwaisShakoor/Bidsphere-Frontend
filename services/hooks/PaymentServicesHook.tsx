"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/components/providers/queryProvider/queryClient";
import { CacheKeys } from "@/enums/cacheKeys";
import { getErrorMessage } from "@/services/Api/getErrorMessage";
import {
  confirmItemPayment,
  deliverItem,
  getItemPayment,
  getMyPayments,
  shipItem,
} from "@/services/Api/PaymentServicesApi";
import type {
  Payment,
  ShipItemRequest,
} from "@/services/types/PaymentServicesTypes";

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
export function usePaymentSuccess(
  itemId: string | null,
  sessionId: string | null,
  enabled: boolean,
) {
  const ranForItem = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (!itemId || !sessionId) {
      toast.success("Payment successful", { id: "payment-success" });
      invalidatePaymentQueries(itemId);
      return;
    }

    if (ranForItem.current === itemId) return;
    ranForItem.current = itemId;

    void (async () => {
      try {
        await confirmItemPayment(itemId, sessionId);
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
  }, [enabled, itemId, sessionId]);
}

export function useShipItem() {
  return useMutation({
    mutationFn: ({
      itemId,
      trackingNote,
    }: ShipItemRequest & { itemId: string }) =>
      shipItem(itemId, { trackingNote }),
    onSuccess: (payment) => {
      toast.success("Item marked as shipped");
      invalidatePaymentQueries(payment.itemId);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeliverItem() {
  return useMutation({
    mutationFn: (itemId: string) => deliverItem(itemId),
    onSuccess: (payment) => {
      toast.success("Delivery confirmed — seller payout released");
      invalidatePaymentQueries(payment.itemId);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
