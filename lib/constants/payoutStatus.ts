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
    label: "Not set up",
    description: "Connect a payout account to receive money from won auctions.",
    buttonLabel: "Set up payouts",
    badgeClassName: "bg-muted text-muted-foreground",
    iconWrapClassName: "bg-muted text-muted-foreground",
  },
  pending: {
    label: "Setup in progress",
    description:
      "Your payout account setup is incomplete. Finish setup to enable payouts.",
    buttonLabel: "Finish setup",
    badgeClassName: "bg-amber-100 text-amber-800",
    iconWrapClassName: "bg-amber-100 text-amber-700",
  },
  connected: {
    label: "Payouts ready",
    description:
      "Your payout account is connected. You can receive payouts from completed sales.",
    buttonLabel: "Manage payouts",
    badgeClassName: "bg-emerald-100 text-emerald-800",
    iconWrapClassName: "bg-emerald-100 text-emerald-700",
  },
};

/** Maps GET /api/me/stripe/status into the UI payout states. */
export function mapStripeStatusToPayoutStatus(
  status: StripeConnectionStatus | undefined,
): PayoutConnectionStatus {
  if (!status?.stripeAccountId) return "not_connected";
  if (!status.connected || !status.payoutEnabled) return "pending";
  return "connected";
}
