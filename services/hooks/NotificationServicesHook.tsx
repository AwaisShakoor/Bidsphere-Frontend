"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/providers/queryProvider/queryClient";
import { CacheKeys } from "@/enums/cacheKeys";
import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/Api/NotificationServicesApi";

export function useMyNotifications(enabled = true) {
  return useQuery({
    queryKey: [CacheKeys.MY_NOTIFICATIONS],
    queryFn: getMyNotifications,
    enabled,
  });
}

export function useMarkNotificationAsRead() {
  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.MY_NOTIFICATIONS],
      });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CacheKeys.MY_NOTIFICATIONS],
      });
    },
  });
}
