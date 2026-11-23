import { getPayoutHistoryLabel } from "@/lib/constants/payoutHistoryStatus";
import type { SellerPayout } from "@/services/types/PayoutServicesTypes";

export type PayoutTab = "pending" | "to_ship" | "transfer_pending" | "paid";

export const PAYOUT_TABS: { value: PayoutTab; label: string }[] = [
  { value: "pending", label: "Awaiting payment" },
  { value: "to_ship", label: "To ship" },
  { value: "transfer_pending", label: "In progress" },
  { value: "paid", label: "Paid" },
];

export function getPayoutTab(payout: SellerPayout): PayoutTab {
  const label = getPayoutHistoryLabel(payout);
  if (label === "Paid") return "paid";
  if (label === "Awaiting shipment") return "to_ship";
  if (
    label === "Transfer pending" ||
    label === "Shipped" ||
    label === "Delivered"
  ) {
    return "transfer_pending";
  }
  return "pending";
}

export function getPayoutsByTab(payouts: SellerPayout[], tab: PayoutTab) {
  return payouts.filter((payout) => getPayoutTab(payout) === tab);
}

export function getDefaultPayoutTab(payouts: SellerPayout[]): PayoutTab {
  if (getPayoutsByTab(payouts, "to_ship").length > 0) return "to_ship";
  if (getPayoutsByTab(payouts, "pending").length > 0) return "pending";
  if (getPayoutsByTab(payouts, "transfer_pending").length > 0) {
    return "transfer_pending";
  }
  return "paid";
}

export function getPayoutTabEmptyMessage(tab: PayoutTab) {
  if (tab === "paid") return "No paid payouts in this list yet.";
  if (tab === "to_ship") {
    return "Nothing waiting to ship. Paid sales that need shipping show up here.";
  }
  if (tab === "transfer_pending") {
    return "No shipped items or transfers in progress right now.";
  }
  return "No payouts awaiting payment right now.";
}
