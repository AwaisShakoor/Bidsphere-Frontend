import { PayoutStatus } from "@/enums/payoutStatus";

const AMBER = "bg-amber-500/10 text-amber-700 dark:text-amber-400";
const EMERALD = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
const DESTRUCTIVE = "bg-destructive/10 text-destructive";
const MUTED = "bg-muted text-muted-foreground";

export function getPayoutHistoryLabel(payout: {
  status: string;
  stripeTransferId: string | null;
}) {
  const status = payout.status.toUpperCase();

  if (status === PayoutStatus.COMPLETED && !payout.stripeTransferId) {
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

export function getPayoutHistoryStatusClass(payout: {
  status: string;
  stripeTransferId: string | null;
}) {
  switch (getPayoutHistoryLabel(payout)) {
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

export function isPayoutTransferPending(
  status: string,
  stripeTransferId: string | null,
) {
  return (
    getPayoutHistoryLabel({ status, stripeTransferId }) === "Transfer pending"
  );
}
