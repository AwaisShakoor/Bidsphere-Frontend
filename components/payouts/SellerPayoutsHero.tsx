"use client";

import { Button } from "@/components/ui/button";
import {
  PAYOUT_STATUS_COPY,
  mapStripeStatusToPayoutStatus,
} from "@/lib/constants/payoutStatus";
import {
  PAYOUT_STATUS_ICON,
  PAYOUT_STEPS,
  PAYOUT_TRUST,
} from "@/lib/constants/payoutsContent";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  useCreateStripeConnect,
  useStripeBalance,
  useStripeStatus,
} from "@/services/hooks/StripeServicesHook";
import { SellerPayoutsSkeleton } from "./SellerPayoutsSkeleton";
import { SellerWithdrawForm } from "./SellerWithdrawForm";

export function SellerPayoutsHero() {
  const { data, isPending, isError, error } = useStripeStatus();
  const status = mapStripeStatusToPayoutStatus(data);
  const isReady = status === "connected";
  const {
    data: balance,
    isPending: isBalancePending,
    isError: isBalanceError,
    error: balanceError,
  } = useStripeBalance(isReady);
  const { mutate: connectStripe, isPending: isConnecting } =
    useCreateStripeConnect();

  if (isPending) {
    return <SellerPayoutsSkeleton />;
  }

  const copy = PAYOUT_STATUS_COPY[status];
  const StatusIcon = PAYOUT_STATUS_ICON[status];

  function handleAction() {
    connectStripe();
  }

  return (
    <div className="flex flex-col gap-3">
      <section className="relative overflow-hidden rounded-2xl bg-primary/6 ring-1 ring-primary/10">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1 bg-primary"
        />

        <div className="relative grid gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="min-w-0 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-primary uppercase">
                Stripe
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  copy.badgeClassName,
                )}
              >
                <StatusIcon
                  className={cn(
                    "size-3",
                    status === "pending" && "animate-spin",
                  )}
                  aria-hidden
                />
                {copy.label}
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {isReady
                  ? "You’re ready to get paid"
                  : "Get paid for your sales"}
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                {isReady
                  ? "Stripe is connected. Keep selling — payouts can flow when sales complete."
                  : "Connect Stripe once, keep running auctions, and receive payouts when your items sell."}
              </p>
              {isError ? (
                <p className="text-sm text-destructive">
                  {error instanceof Error
                    ? error.message
                    : "Could not load Stripe status."}
                </p>
              ) : null}
            </div>

            {isReady ? (
              <div className="space-y-3">
                <div className="grid max-w-md grid-cols-2 gap-2">
                  <div className="rounded-xl bg-card/90 px-3.5 py-3 ring-1 ring-border">
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Available
                    </p>
                    {isBalancePending ? (
                      <div className="mt-2 h-7 w-20 animate-pulse rounded bg-muted" />
                    ) : (
                      <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-foreground">
                        {formatMoney(balance?.available ?? 0)}
                      </p>
                    )}
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Ready to withdraw
                    </p>
                  </div>
                  <div className="rounded-xl bg-card/90 px-3.5 py-3 ring-1 ring-border">
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Pending
                    </p>
                    {isBalancePending ? (
                      <div className="mt-2 h-7 w-20 animate-pulse rounded bg-muted" />
                    ) : (
                      <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-foreground">
                        {formatMoney(balance?.pending ?? 0)}
                      </p>
                    )}
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Not withdrawable yet
                    </p>
                  </div>
                  {isBalanceError ? (
                    <p className="col-span-2 text-sm text-destructive">
                      {balanceError instanceof Error
                        ? balanceError.message
                        : "Could not load balance."}
                    </p>
                  ) : null}
                </div>

                <SellerWithdrawForm
                  available={balance?.available ?? 0}
                  disabled={isBalancePending || isBalanceError}
                />
              </div>
            ) : null}

            {!isReady ? (
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  className="h-10 px-4"
                  onClick={handleAction}
                  disabled={isConnecting}
                >
                  {isConnecting ? "Redirecting…" : copy.buttonLabel}
                </Button>
                <p className="text-xs text-muted-foreground sm:pl-1">
                  Setup takes a few minutes. You can finish later anytime.
                </p>
              </div>
            ) : null}
          </div>

          <div className="rounded-xl bg-card/90 p-3.5 ring-1 ring-border sm:p-4">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              How it works
            </p>
            <ol className="mt-2.5 space-y-2.5">
              {PAYOUT_STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.Icon className="size-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-foreground">
                      <span className="mr-1.5 text-primary tabular-nums">
                        {index + 1}.
                      </span>
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="grid gap-2 sm:grid-cols-3">
        {PAYOUT_TRUST.map((item) => (
          <div
            key={item.title}
            className="rounded-xl bg-card px-3.5 py-3 ring-1 ring-border"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <item.Icon className="size-3.5" aria-hidden />
            </span>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {item.title}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
