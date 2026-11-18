import type { StripeConnectionStatus } from "@/services/types/StripeServicesTypes";

export type PayoutConnectionStatus = "not_connected" | "pending" | "connected";

export const PAYOUT_STATUS_COPY: Record<
  PayoutConnectionStatus,
  {
    label: string;
    description: string;
    buttonLabel: string;
    badgeClassName: string;
    iconWrapClassName: string;
  }
> = {
  not_connected: {
    label: "Not connected",
    description: "Connect Stripe to receive payouts from won auctions.",
    buttonLabel: "Connect Stripe",
    badgeClassName: "bg-muted text-muted-foreground",
    iconWrapClassName: "bg-muted text-muted-foreground",
  },
  pending: {
    label: "Pending",
    description:
      "Your Stripe account setup is incomplete. Finish setup to enable payouts.",
    buttonLabel: "Finish setup",
    badgeClassName: "bg-amber-100 text-amber-800",
    iconWrapClassName: "bg-amber-100 text-amber-700",
  },
  connected: {
    label: "Payouts ready",
    description:
      "Stripe is connected. You can receive payouts from completed sales.",
    buttonLabel: "Manage payouts",
    badgeClassName: "bg-emerald-100 text-emerald-800",
    iconWrapClassName: "bg-emerald-100 text-emerald-700",
  },
};

/** Maps GET /api/me/stripe/status into the UI payout states. */
export function mapStripeStatusToPayoutStatus(
  status: StripeConnectionStatus | undefined,
): PayoutConnectionStatus {
  if (!status?.connected) return "not_connected";
  if (!status.payoutEnabled) return "pending";
  return "connected";
}
