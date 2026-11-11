export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED",
}

export const PAYMENT_STATUS_CLASS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]:
    "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  [PaymentStatus.COMPLETED]:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  [PaymentStatus.REFUNDED]: "bg-muted text-muted-foreground",
  [PaymentStatus.FAILED]: "bg-destructive/10 text-destructive",
};

export function getPaymentStatusClass(status: string) {
  const key = status.toUpperCase() as PaymentStatus;
  return PAYMENT_STATUS_CLASS[key] ?? "bg-muted text-muted-foreground";
}
