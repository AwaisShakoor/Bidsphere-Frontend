"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Inbox } from "lucide-react";
import { NotificationRow } from "@/components/notifications/NotificationRow";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useMyNotifications,
} from "@/services/hooks/NotificationServicesHook";

type NotificationBellProps = {
  enabled?: boolean;
};

export function NotificationBell({ enabled = true }: NotificationBellProps) {
  const {
    data: notifications = [],
    isPending,
    isError,
  } = useMyNotifications(enabled);
  const { mutate: markNotificationAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllNotificationsAsRead, isPending: isMarkingAllRead } =
    useMarkAllNotificationsAsRead();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  function handleSelectNotification(notificationId: string, isRead: boolean) {
    if (!isRead) markNotificationAsRead(notificationId);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          "relative h-9 w-9 rounded-lg border-border/80 bg-background p-0 text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
          open &&
            "border-primary/40 bg-primary/10 text-primary shadow-none hover:bg-primary/15 hover:text-primary",
        )}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="size-3.5" />
        {unreadCount > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground tabular-nums">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </Button>

      {open ? (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute top-[calc(100%+0.4rem)] right-0 z-50 w-[min(19.5rem,calc(100vw-1.25rem))] overflow-hidden rounded-xl bg-card shadow-md shadow-primary/8 ring-1 ring-border/70"
        >
          <div className="flex h-9 items-center justify-between gap-2 border-b border-border/60 px-3">
            <p className="text-[13px] font-semibold text-foreground">
              Notifications
            </p>
            {unreadCount > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="h-6 px-2 text-[11px] font-medium text-primary hover:bg-primary/10 hover:text-primary"
                disabled={isMarkingAllRead}
                onClick={() => markAllNotificationsAsRead(undefined)}
              >
                {isMarkingAllRead ? "Marking…" : "Mark all read"}
              </Button>
            ) : (
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {notifications.length}
              </span>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isPending ? (
              <div className="divide-y divide-border/50">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 px-3 py-2"
                  >
                    <div className="size-7 shrink-0 animate-pulse rounded-md bg-muted" />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="h-3 w-[85%] animate-pulse rounded bg-muted" />
                      <div className="h-2.5 w-1/3 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <p className="px-3 py-6 text-center text-[13px] text-destructive">
                Could not load notifications.
              </p>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-1.5 px-3 py-7 text-center">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-muted/80 text-muted-foreground">
                  <Inbox className="size-3.5" aria-hidden />
                </span>
                <p className="text-[13px] font-medium text-foreground">
                  Nothing here yet
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Bids and payments will show up here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border/50">
                {notifications.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onSelect={() =>
                      handleSelectNotification(
                        notification.id,
                        notification.isRead,
                      )
                    }
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
