"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/components/providers/queryProvider/queryClient";
import { CacheKeys } from "@/enums/cacheKeys";
import {
  getItemBids,
  getMyBids,
  placeBid,
} from "@/services/Api/BidServicesApi";
import type { PlaceBidRequest } from "@/services/types/BidServicesTypes";

export function useItemBids(itemId: string | null) {
  return useQuery({
    queryKey: [CacheKeys.ITEM_BIDS, itemId],
    queryFn: () => getItemBids(itemId!),
    enabled: Boolean(itemId),
  });
}

export function useMyBids(enabled = true) {
  return useQuery({
    queryKey: [CacheKeys.MY_BIDS],
    queryFn: getMyBids,
    enabled,
  });
}

export function usePlaceBid() {
  return useMutation({
    mutationFn: ({ itemId, ...body }: PlaceBidRequest & { itemId: string }) =>
      placeBid(itemId, body),
    onSuccess: (data) => {
      toast.success(data.message || "Bid placed successfully!");
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.ITEM_BIDS, data.bid.itemId],
      });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.MY_BIDS] });
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.PUBLIC_ITEM, data.bid.itemId],
      });
      queryClient.invalidateQueries({ queryKey: [CacheKeys.PUBLIC_ITEMS] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
