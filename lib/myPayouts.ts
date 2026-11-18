import { isPayoutPaid } from "@/lib/constants/payoutHistoryStatus";
import type { SellerPayout } from "@/services/types/PayoutServicesTypes";

export type PayoutTab = "pending" | "paid";

export const PAYOUT_TABS: { value: PayoutTab; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
];

export function getPayoutsByTab(payouts: SellerPayout[], tab: PayoutTab) {
  return payouts.filter((payout) => {
    const paid = isPayoutPaid(payout.status, payout.paidAt);
    return tab === "paid" ? paid : !paid;
  });
}

export function getPayoutTabEmptyMessage(tab: PayoutTab) {
  return tab === "paid"
    ? "No paid payouts in this list yet."
    : "No pending payouts right now.";
}
