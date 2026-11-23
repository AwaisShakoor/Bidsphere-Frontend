import api from "@/services/apiClient";
import { getErrorMessage } from "@/services/Api/getErrorMessage";
import type {
  MarkAllNotificationsReadResponse,
  MarkNotificationReadResponse,
  Notification,
  NotificationsResponse,
} from "@/services/types/NotificationServicesTypes";

export async function getMyNotifications(): Promise<Notification[]> {
  try {
    const { data } = await api.get<NotificationsResponse>(
      "/api/me/notifications",
    );
    return data.notifications ?? [];
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load notifications");
  }
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<MarkNotificationReadResponse> {
  try {
    const { data } = await api.patch<MarkNotificationReadResponse>(
      `/api/me/notifications/${notificationId}/read`,
    );
    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error) || "Failed to mark notification as read",
    );
  }
}

export async function markAllNotificationsAsRead(): Promise<MarkAllNotificationsReadResponse> {
  try {
    const { data } = await api.patch<MarkAllNotificationsReadResponse>(
      "/api/me/notifications/read-all",
    );
    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error) || "Failed to mark all notifications as read",
    );
  }
}
