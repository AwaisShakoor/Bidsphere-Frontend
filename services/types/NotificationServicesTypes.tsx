export type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  auctionId: string | null;
  itemId: string | null;
};

export type NotificationsResponse = {
  message?: string;
  notifications: Notification[];
};

export type MarkNotificationReadResponse = {
  message?: string;
};

export type MarkAllNotificationsReadResponse = {
  message?: string;
  count: number;
};
