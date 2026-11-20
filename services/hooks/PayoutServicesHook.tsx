"use client";

import { useQuery } from "@tanstack/react-query";
import { CacheKeys } from "@/enums/cacheKeys";
import { getMyPayouts } from "@/services/Api/PayoutServicesApi";
import type { SellerPayout } from "@/services/types/PayoutServicesTypes";

export function useMyPayouts(enabled = true) {
  return useQuery<SellerPayout[]>({
    queryKey: [CacheKeys.MY_PAYOUTS],
    queryFn: getMyPayouts,
    enabled,
  });
}
