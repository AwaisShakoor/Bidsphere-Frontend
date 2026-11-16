import Link from "next/link";
import { Button } from "@/components/ui/button";
import { iconForType } from "@/lib/constants/notifications";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Notification } from "@/services/types/NotificationServicesTypes";

type NotificationRowProps = {
  notification: Notification;
  onSelect?: () => void;
};

function NotificationRowBody({ notification }: { notification: Notification }) {
  const Icon = iconForType(notification.type);
  const unread = !notification.isRead;

  return (
    <>
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md",
          unread
            ? "bg-primary text-primary-foreground"
            : "bg-muted/80 text-muted-foreground",
        )}
      >
        <Icon className="size-3" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "line-clamp-1 text-[12.5px] leading-snug text-foreground",
            unread ? "font-semibold" : "font-medium",
          )}
        >
          {notification.title}
        </span>
        <span className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
          {notification.message}
        </span>
        <time
          dateTime={notification.createdAt}
          className="mt-0.5 block text-[10px] text-muted-foreground tabular-nums"
        >
          {formatRelativeTime(notification.createdAt)}
        </time>
      </span>
      {unread ? (
        <span
          className="size-1.5 shrink-0 rounded-full bg-primary"
          aria-hidden
        />
      ) : null}
    </>
  );
}

export function NotificationRow({
  notification,
  onSelect,
}: NotificationRowProps) {
  const href = notification.itemId ? `/items/${notification.itemId}` : null;
  const unread = !notification.isRead;
  const className = cn(
    "h-auto w-full items-start justify-start gap-2.5 rounded-none px-3 py-2 text-left whitespace-normal hover:bg-accent/60",
    unread && "bg-primary/[0.04]",
  );

  return (
    <li>
      {href ? (
        <Button asChild variant="ghost" className={className}>
          <Link href={href} onClick={onSelect}>
            <NotificationRowBody notification={notification} />
          </Link>
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          className={className}
          onClick={onSelect}
        >
          <NotificationRowBody notification={notification} />
        </Button>
      )}
    </li>
  );
}
