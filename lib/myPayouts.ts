import { getPayoutHistoryLabel } from "@/lib/constants/payoutHistoryStatus";
import type { SellerPayout } from "@/services/types/PayoutServicesTypes";

export type PayoutTab = "pending" | "transfer_pending" | "paid";

export const PAYOUT_TABS: { value: PayoutTab; label: string }[] = [
  { value: "pending", label: "Awaiting payment" },
  { value: "transfer_pending", label: "Transfer pending" },
  { value: "paid", label: "Paid" },
];

export function getPayoutTab(payout: SellerPayout): PayoutTab {
  const label = getPayoutHistoryLabel(payout);
  if (label === "Transfer pending") return "transfer_pending";
  if (label === "Paid") return "paid";
  return "pending";
}

export function getPayoutsByTab(payouts: SellerPayout[], tab: PayoutTab) {
  return payouts.filter((payout) => getPayoutTab(payout) === tab);
}

export function getPayoutTabEmptyMessage(tab: PayoutTab) {
  if (tab === "paid") return "No paid payouts in this list yet.";
  if (tab === "transfer_pending") {
    return "No payouts waiting on bank transfer right now.";
  }
  return "No payouts awaiting payment right now.";
}
