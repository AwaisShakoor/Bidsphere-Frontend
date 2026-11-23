"use client";

import { CheckCircle2, Truck } from "lucide-react";
import { RefundReason } from "@/components/payments/RefundReason";
import { ConfirmDeliveryButton } from "./ConfirmDeliveryButton";
import { ShipItemForm } from "./ShipItemForm";
import { DeliveryStatus } from "@/enums/deliveryStatus";
import {
  getDeliveryStatusClass,
  getDeliveryStatusLabel,
} from "@/lib/constants/deliveryStatus";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PublicItemPayment } from "@/services/types/ItemsServicesTypes";
import type { Payment } from "@/services/types/PaymentServicesTypes";

type ItemShippingPanelProps = {
  itemId: string;
  itemTitle?: string;
  payment: Payment | PublicItemPayment;
  variant: "seller" | "buyer";
};

export function ItemShippingPanel({
  itemId,
  payment,
  variant,
}: ItemShippingPanelProps) {
  const deliveryStatus = payment.deliveryStatus?.toUpperCase() ?? null;
  const deliveryLabel = getDeliveryStatusLabel(deliveryStatus);
  const isAwaitingShipment =
    deliveryStatus === DeliveryStatus.AWAITING_SHIPMENT;
  const isShipped = deliveryStatus === DeliveryStatus.SHIPPED;
  const isDelivered = deliveryStatus === DeliveryStatus.DELIVERED;
  const hasRefundRequest = Boolean(payment.refundRequestedAt);

  if (variant === "seller" && isAwaitingShipment) {
    return <ShipItemForm itemId={itemId} />;
  }

  if (!deliveryLabel) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border p-4 shadow-sm",
        isDelivered
          ? "border-emerald-500/25 bg-linear-to-br from-emerald-500/12 via-card to-card shadow-emerald-500/5"
          : isShipped
            ? "border-sky-500/25 bg-linear-to-br from-sky-500/12 via-card to-card shadow-sky-500/5"
            : "border-amber-500/25 bg-linear-to-br from-amber-500/12 via-card to-card shadow-amber-500/5",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-lg ring-1",
            isDelivered
              ? "bg-emerald-500/15 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300"
              : isShipped
                ? "bg-sky-500/15 text-sky-700 ring-sky-500/25 dark:text-sky-300"
                : "bg-amber-500/15 text-amber-700 ring-amber-500/25 dark:text-amber-300",
          )}
        >
          {isDelivered || isShipped ? (
            <CheckCircle2 className="size-4" aria-hidden />
          ) : (
            <Truck className="size-4" aria-hidden />
          )}
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">Shipping</p>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                getDeliveryStatusClass(deliveryStatus),
              )}
            >
              {deliveryLabel}
            </span>
          </div>

          {variant === "seller" && isShipped ? (
            <p className="inline-flex max-w-full items-start gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2 py-1.5 text-[11px] font-semibold leading-snug text-sky-900 dark:text-sky-200">
              Waiting for buyer to confirm delivery — payout stays held until
              then.
            </p>
          ) : null}

          {variant === "seller" && isDelivered ? (
            <p className="inline-flex max-w-full items-start gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1.5 text-[11px] font-semibold leading-snug text-emerald-900 dark:text-emerald-200">
              Buyer confirmed delivery. Payout has been released to your
              account.
            </p>
          ) : null}

          {variant === "buyer" && isAwaitingShipment ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                The seller will ship your item soon.
              </p>
              {hasRefundRequest ? (
                <div className="space-y-1.5">
                  <p className="inline-flex max-w-full items-start gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-[11px] font-semibold leading-snug text-amber-900 dark:text-amber-200">
                    Refund requested
                    {payment.refundRequestedAt
                      ? ` on ${formatDate(payment.refundRequestedAt)}`
                      : ""}
                    . An admin will review it.
                  </p>
                  {payment.refundRequestReason ? (
                    <RefundReason reason={payment.refundRequestReason} />
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          {variant === "buyer" && isShipped ? (
            <div className="space-y-2">
              <p className="inline-flex max-w-full items-start gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2 py-1.5 text-[11px] font-semibold leading-snug text-sky-900 dark:text-sky-200">
                Item shipped. Confirm delivery when you receive it — that
                releases the seller payout.
              </p>
              <ConfirmDeliveryButton itemId={itemId} />
            </div>
          ) : null}

          {variant === "buyer" && isDelivered ? (
            <p className="inline-flex max-w-full items-start gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1.5 text-[11px] font-semibold leading-snug text-emerald-900 dark:text-emerald-200">
              Delivery confirmed. Thanks — the seller payout has been released.
            </p>
          ) : null}

          {payment.shippedAt ? (
            <p className="text-xs text-muted-foreground">
              Shipped {formatDate(payment.shippedAt)}
            </p>
          ) : null}
          {payment.trackingNote ? (
            <p className="rounded-lg border border-border/80 bg-background/60 px-2.5 py-2 text-xs text-foreground">
              <span className="font-medium text-muted-foreground">Note: </span>
              {payment.trackingNote}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
