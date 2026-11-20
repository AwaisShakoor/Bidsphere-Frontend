"use client";

import Link from "next/link";
import { ArrowRight, LoaderCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PAYOUT_STATUS_COPY,
  mapStripeStatusToPayoutStatus,
} from "@/lib/constants/payoutStatus";
import { cn } from "@/lib/utils";
import { useStripeStatus } from "@/services/hooks/StripeServicesHook";

export function SellerPayoutsBanner() {
  const { data, isPending } = useStripeStatus();
  const status = mapStripeStatusToPayoutStatus(data);

  if (isPending || status === "connected") return null;

  const copy = PAYOUT_STATUS_COPY[status];
  const isSetupPending = status === "pending";

  return (
    <aside
      className={cn(
        "flex flex-col gap-3 rounded-xl px-4 py-3 ring-1 sm:flex-row sm:items-center sm:justify-between",
        isSetupPending
          ? "bg-amber-50 ring-amber-200/80"
          : "bg-primary/5 ring-primary/15",
      )}
    >
      <div className="flex min-w-0 items-start gap-3 sm:items-center">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            copy.iconWrapClassName,
          )}
        >
          {isSetupPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
          ) : (
            <Wallet className="size-4" aria-hidden />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {isSetupPending ? "Finish payout setup" : "Set up payouts"}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {isSetupPending
              ? "Your payout account still needs a few steps before you can get paid."
              : "Connect a payout account so you can receive money from completed sales."}
          </p>
        </div>
      </div>

      <Button asChild size="sm" className="w-full shrink-0 sm:w-auto">
        <Link href="/my-payouts">
          {isSetupPending ? "Finish setup" : "Set up payouts"}
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    </aside>
  );
}
