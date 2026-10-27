"use client";

import { useQuery } from "@tanstack/react-query";
import { CacheKeys } from "@/enums/cacheKeys";
import {
  getAdminAuctions,
  getAdminUsers,
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
