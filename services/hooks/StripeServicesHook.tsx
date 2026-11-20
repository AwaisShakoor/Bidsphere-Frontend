"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/components/providers/queryProvider/queryClient";
import { CacheKeys } from "@/enums/cacheKeys";
import {
  createStripeConnect,
  createStripeWithdraw,
  getStripeBalance,
  getStripeStatus,
} from "@/services/Api/StripeServicesApi";
import type {
  StripeBalance,
  StripeConnectionStatus,
} from "@/services/types/StripeServicesTypes";

export function useStripeStatus(enabled = true) {
  return useQuery<StripeConnectionStatus>({
    queryKey: [CacheKeys.STRIPE_STATUS],
    queryFn: getStripeStatus,
    enabled,
  });
}

export function useStripeBalance(enabled = true) {
  return useQuery<StripeBalance>({
    queryKey: [CacheKeys.STRIPE_BALANCE],
    queryFn: getStripeBalance,
    enabled,
  });
}

export function useCreateStripeConnect() {
  return useMutation({
    mutationFn: createStripeConnect,
    onSuccess: (result) => {
      queryClient.removeQueries({ queryKey: [CacheKeys.STRIPE_STATUS] });
      queryClient.removeQueries({ queryKey: [CacheKeys.STRIPE_BALANCE] });
      if (!result.url) {
        toast.error("Could not start payout setup");
        return;
      }

      window.location.assign(result.url);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useCreateStripeWithdraw() {
  return useMutation({
    mutationFn: (amount: number) => createStripeWithdraw(amount),
    onSuccess: (data) => {
      toast.success(
        data.message ||
          "Withdraw started. Funds usually arrive in 1–2 business days.",
      );
      queryClient.invalidateQueries({ queryKey: [CacheKeys.STRIPE_BALANCE] });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_PAYOUTS] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
