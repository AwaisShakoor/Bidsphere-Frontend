import { PayoutStatus } from "@/enums/payoutStatus";

export const PAYOUT_HISTORY_STATUS_CLASS: Record<string, string> = {
  [PayoutStatus.PENDING]: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  [PayoutStatus.PAID]:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  [PayoutStatus.COMPLETED]:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  [PayoutStatus.FAILED]: "bg-destructive/10 text-destructive",
};

export function getPayoutHistoryStatusClass(status: string) {
  return (
    PAYOUT_HISTORY_STATUS_CLASS[status.toUpperCase()] ??
    "bg-muted text-muted-foreground"
  );
}

export function isPayoutPaid(status: string, paidAt: string | null) {
  if (paidAt) return true;
  const key = status.toUpperCase();
  return key === PayoutStatus.PAID || key === PayoutStatus.COMPLETED;
}
