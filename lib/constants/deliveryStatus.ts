import { DeliveryStatus } from "@/enums/deliveryStatus";

const AMBER = "bg-amber-500/10 text-amber-700 dark:text-amber-400";
const SKY = "bg-sky-500/10 text-sky-700 dark:text-sky-400";
const EMERALD = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
const MUTED = "bg-muted text-muted-foreground";

export const DELIVERY_STATUS_LABEL: Record<DeliveryStatus, string> = {
  [DeliveryStatus.AWAITING_SHIPMENT]: "Awaiting shipment",
  [DeliveryStatus.SHIPPED]: "Shipped",
  [DeliveryStatus.DELIVERED]: "Delivered",
};

export const DELIVERY_STATUS_CLASS: Record<DeliveryStatus, string> = {
  [DeliveryStatus.AWAITING_SHIPMENT]: AMBER,
  [DeliveryStatus.SHIPPED]: SKY,
  [DeliveryStatus.DELIVERED]: EMERALD,
};

export function getDeliveryStatusLabel(status: string | null | undefined) {
  if (!status) return null;
  const key = status.toUpperCase() as DeliveryStatus;
  return DELIVERY_STATUS_LABEL[key] ?? null;
}

export function getDeliveryStatusClass(status: string | null | undefined) {
  if (!status) return MUTED;
  const key = status.toUpperCase() as DeliveryStatus;
  return DELIVERY_STATUS_CLASS[key] ?? MUTED;
}
