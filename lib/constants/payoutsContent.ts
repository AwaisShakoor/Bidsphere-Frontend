import {
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  Gavel,
  LoaderCircle,
  Lock,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import type { PayoutConnectionStatus } from "@/lib/constants/payoutStatus";

export const PAYOUT_STATUS_ICON = {
  not_connected: Wallet,
  pending: LoaderCircle,
  connected: CheckCircle2,
} as const satisfies Record<
  PayoutConnectionStatus,
  typeof Wallet | typeof LoaderCircle | typeof CheckCircle2
>;

export const PAYOUT_STEPS = [
  {
    title: "Set up payouts",
    body: "Link your bank account in a few guided steps.",
    Icon: CreditCard,
  },
  {
    title: "Sell on BidSphere",
    body: "Run auctions and close sales as you do today.",
    Icon: Gavel,
  },
  {
    title: "Get paid",
    body: "Payouts land after sales complete — track status anytime.",
    Icon: Wallet,
  },
] as const;

export const PAYOUT_TRUST = [
  {
    title: "Secure payouts",
    body: "Bank-grade rails sellers already trust.",
    Icon: ShieldCheck,
  },
  {
    title: "Paid after sale",
    body: "Funds move when the auction sale is complete.",
    Icon: BadgeCheck,
  },
  {
    title: "You’re in control",
    body: "See connection status and finish setup when ready.",
    Icon: Lock,
  },
] as const;
