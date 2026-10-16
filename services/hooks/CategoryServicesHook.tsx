"use client";

import { useQuery } from "@tanstack/react-query";
import { CacheKeys } from "@/enums/cacheKeys";
import { getCategories } from "@/services/Api/CategoryServicesApi";

export function useCategories() {
  return useQuery({
    queryKey: [CacheKeys.CATEGORIES],
    queryFn: getCategories,
  });
}
