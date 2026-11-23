import { DeliveryStatus } from "@/enums/deliveryStatus";
import { PayoutStatus } from "@/enums/payoutStatus";
import {
  getDeliveryStatusClass,
  getDeliveryStatusLabel,
} from "@/lib/constants/deliveryStatus";

const AMBER = "bg-amber-500/10 text-amber-700 dark:text-amber-400";
const EMERALD = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
const DESTRUCTIVE = "bg-destructive/10 text-destructive";
const MUTED = "bg-muted text-muted-foreground";

export type PayoutHistoryFields = {
  status: string;
  stripeTransferId: string | null;
  deliveryStatus?: string | null;
};

export function getPayoutHistoryLabel(payout: PayoutHistoryFields) {
  const status = payout.status.toUpperCase();

  if (status === PayoutStatus.COMPLETED && !payout.stripeTransferId) {
    const deliveryLabel = getDeliveryStatusLabel(payout.deliveryStatus);
    if (deliveryLabel) return deliveryLabel;
    return "Transfer pending";
  }
  if (status === PayoutStatus.COMPLETED || status === PayoutStatus.PAID) {
    return "Paid";
  }
  if (status === PayoutStatus.PENDING) {
    return "Awaiting payment";
  }
  if (status === PayoutStatus.FAILED) {
    return "Failed";
  }

  return payout.status;
}

export function getPayoutHistoryStatusClass(payout: PayoutHistoryFields) {
  const label = getPayoutHistoryLabel(payout);

  if (
    label === getDeliveryStatusLabel(DeliveryStatus.AWAITING_SHIPMENT) ||
    label === getDeliveryStatusLabel(DeliveryStatus.SHIPPED) ||
    label === getDeliveryStatusLabel(DeliveryStatus.DELIVERED)
  ) {
    return getDeliveryStatusClass(payout.deliveryStatus);
  }

  switch (label) {
    case "Transfer pending":
    case "Awaiting payment":
      return AMBER;
    case "Paid":
      return EMERALD;
    case "Failed":
      return DESTRUCTIVE;
    default:
      return MUTED;
  }
}

export function isPayoutPaid(status: string, paidAt: string | null) {
  if (paidAt) return true;
  const key = status.toUpperCase();
  return key === PayoutStatus.PAID || key === PayoutStatus.COMPLETED;
}

export function isPayoutTransferPending(payout: PayoutHistoryFields) {
  const label = getPayoutHistoryLabel(payout);
  return (
    label === "Transfer pending" ||
    label === getDeliveryStatusLabel(DeliveryStatus.AWAITING_SHIPMENT) ||
    label === getDeliveryStatusLabel(DeliveryStatus.SHIPPED) ||
    label === getDeliveryStatusLabel(DeliveryStatus.DELIVERED)
  );
}
