"use client";

import Link from "next/link";
import { ArrowRight, CreditCard, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPaymentStatusClass, PaymentStatus } from "@/enums/paymentStatus";
import { formatDate, formatMoney, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useMyPayments } from "@/services/hooks/PaymentServicesHook";

export function MyPayments() {
  const { data: payments = [], isPending, isError, error } = useMyPayments();

  return (
    <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
      <div className="px-4 py-3 sm:px-5">
        {isPending ? (
          <div className="divide-y divide-border/70">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="py-2.5">
                <div className="h-10 animate-pulse rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="py-2 text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Could not load payments."}
          </p>
        ) : payments.length === 0 ? (
          <EmptyState
            icon={<Inbox className="size-5" aria-hidden />}
            title="No payments yet"
            description="When you win an auction and pay, it will show up here."
            action={
              <Button type="button" size="sm" asChild>
                <Link href="/my-bids">Go to My bids</Link>
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-border/70">
            {payments.map((payment) => {
              const isPendingPay = payment.status === PaymentStatus.PENDING;
              const isCompleted = payment.status === PaymentStatus.COMPLETED;

              return (
                <li key={payment.id}>
                  <div className="flex items-center gap-2 rounded-lg px-2 py-2.5 sm:gap-3">
                    <Link
                      href={`/items/${payment.itemId}`}
                      className="group flex min-w-0 flex-1 items-center gap-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <CreditCard className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {payment.item?.title || "Untitled item"}
                          </p>
                          <span
                            className={cn(
                              "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                              getPaymentStatusClass(payment.status),
                            )}
                          >
                            {formatSnakeCase(payment.status)}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {payment.auction?.title || "Auction"}
                          <span className="mx-1.5 text-border">·</span>
                          {isCompleted && payment.paidAt
                            ? `Paid ${formatDate(payment.paidAt)}`
                            : `Due ${formatDate(payment.paymentDeadline)}`}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <p
                          className={cn(
                            "text-sm font-semibold tabular-nums",
                            isCompleted
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-primary",
                          )}
                        >
                          {formatMoney(payment.amount)}
                        </p>
                        {!isPendingPay ? (
                          <ArrowRight
                            className="size-3.5 shrink-0 text-muted-foreground opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                            aria-hidden
                          />
                        ) : null}
                      </div>
                    </Link>

                    {isPendingPay ? (
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 gap-1.5 px-3 shadow-sm shadow-primary/25"
                        asChild
                      >
                        <Link href={`/checkout/${payment.itemId}`}>
                          <CreditCard className="size-3.5" />
                          Pay now
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
