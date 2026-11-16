import { PaymentStatus } from "@/enums/paymentStatus";

export type PaymentDeadlineTone = "due" | "overdue";

export const PAYMENT_STATUS_CLASS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]:
    "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  [PaymentStatus.COMPLETED]:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  [PaymentStatus.REFUNDED]: "bg-muted text-muted-foreground",
  [PaymentStatus.FAILED]: "bg-destructive/10 text-destructive",
};

export const PAYMENT_DEADLINE_CLASS: Record<PaymentDeadlineTone, string> = {
  due: "border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  overdue: "border-destructive/30 bg-destructive/10 text-destructive",
};

export const PAYMENT_DEADLINE_LABEL: Record<PaymentDeadlineTone, string> = {
  due: "Due",
  overdue: "Overdue",
};

export function getPaymentStatusClass(status: string) {
  const key = status.toUpperCase() as PaymentStatus;
  return PAYMENT_STATUS_CLASS[key] ?? "bg-muted text-muted-foreground";
}

export function getPaymentDeadlineTone(deadline: string): PaymentDeadlineTone {
  const msLeft = +new Date(deadline) - Date.now();
  if (Number.isNaN(msLeft) || msLeft >= 0) return "due";
  return "overdue";
}
