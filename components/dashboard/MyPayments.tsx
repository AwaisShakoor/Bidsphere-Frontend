"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
  Clock,
  CreditCard,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  getPaymentDeadlineTone,
  getPaymentStatusClass,
  PAYMENT_DEADLINE_CLASS,
  PAYMENT_DEADLINE_LABEL,
} from "@/lib/constants/paymentStatus";
import {
  formatDate,
  formatMoney,
  formatSnakeCase,
  titleInitial,
} from "@/lib/format";
import {
  getPaymentsByTab,
  getPaymentTabEmptyMessage,
  PAYMENT_TABS,
  type PaymentTab,
} from "@/lib/myPayments";
import { cn } from "@/lib/utils";
import { useMyPayments } from "@/services/hooks/PaymentServicesHook";

export function MyPayments() {
  const { data: payments = [], isPending, isError, error } = useMyPayments();
  const [tab, setTab] = useState<PaymentTab>("paid");
  const unpaid = getPaymentsByTab(payments, "unpaid");
  const paid = getPaymentsByTab(payments, "paid");
  const items = tab === "paid" ? paid : unpaid;
  const counts = { paid: paid.length, unpaid: unpaid.length };

  if (isPending) {
    return (
      <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        <div className="space-y-3 px-4 py-4 sm:px-5">
          <div className="h-10 w-48 animate-pulse rounded-xl bg-muted" />
          <div className="divide-y divide-border/70">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 py-3.5">
                <div className="size-12 shrink-0 animate-pulse rounded-xl bg-muted" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-4 w-14 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        <p className="px-4 py-5 text-sm text-destructive sm:px-5">
          {error instanceof Error ? error.message : "Could not load payments."}
        </p>
      </section>
    );
  }

  if (payments.length === 0) {
    return (
      <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        <div className="px-4 py-6 sm:px-5">
          <EmptyState
            icon={<Inbox className="size-5" aria-hidden />}
            title="No payments yet"
            description="When you win an auction, unpaid and paid items will show up here."
            action={
              <Button type="button" size="sm" asChild>
                <Link href="/my-bids">Go to My bids</Link>
              </Button>
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
      <div className="space-y-4 px-4 py-4 sm:px-5">
        {unpaid.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/8 px-3.5 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {unpaid.length} unpaid {unpaid.length === 1 ? "item" : "items"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Complete checkout before the payment deadline.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              className="h-9 gap-1.5 px-3.5 shadow-sm shadow-primary/25"
              onClick={() => setTab(tab === "unpaid" ? "paid" : "unpaid")}
            >
              {tab === "unpaid" ? (
                <>
                  <CircleCheck className="size-3.5" />
                  View paid
                </>
              ) : (
                <>
                  <CreditCard className="size-3.5" />
                  View unpaid
                </>
              )}
            </Button>
          </div>
        ) : null}

        <div
          role="tablist"
          aria-label="Filter payments"
          className="inline-flex max-w-full flex-wrap rounded-xl border border-border/80 bg-muted/40 p-1"
        >
          {PAYMENT_TABS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
                tab === value
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
              <span
                className={cn(
                  "tabular-nums",
                  tab === value ? "text-primary" : "opacity-70",
                )}
              >
                {counts[value]}
              </span>
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {getPaymentTabEmptyMessage(tab)}
          </p>
        ) : (
          <ul className="divide-y divide-border/70">
            {items.map((payment) => {
              const isUnpaid = tab === "unpaid";
              const title = payment.item?.title || "Untitled item";
              const deadlineTone = isUnpaid
                ? getPaymentDeadlineTone(payment.paymentDeadline)
                : null;

              return (
                <li key={payment.id}>
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-1.5 py-3.5 transition-colors sm:gap-3 sm:px-2",
                      isUnpaid && deadlineTone === "overdue"
                        ? "bg-destructive/4 hover:bg-destructive/8"
                        : isUnpaid
                          ? "hover:bg-amber-500/5"
                          : "hover:bg-emerald-500/5",
                    )}
                  >
                    <Link
                      href={`/items/${payment.itemId}`}
                      className="group flex min-w-0 flex-1 items-center gap-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <span
                        className={cn(
                          "inline-flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-semibold tracking-wide",
                          isUnpaid
                            ? deadlineTone === "overdue"
                              ? "bg-destructive/15 text-destructive"
                              : "bg-amber-500/15 text-amber-800 dark:text-amber-300"
                            : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
                        )}
                      >
                        {titleInitial(title)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                            {title}
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
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {payment.auction?.title || "Auction"}
                          {!isUnpaid ? (
                            <>
                              <span className="mx-1.5 text-border">·</span>
                              Paid {formatDate(payment.paidAt ?? "")}
                            </>
                          ) : null}
                        </p>
                        {isUnpaid && deadlineTone ? (
                          <p
                            className={cn(
                              "mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-semibold",
                              PAYMENT_DEADLINE_CLASS[deadlineTone],
                            )}
                          >
                            <Clock className="size-3 shrink-0" aria-hidden />
                            <span className="shrink-0">
                              {PAYMENT_DEADLINE_LABEL[deadlineTone]}
                            </span>
                            <span className="truncate tabular-nums font-medium">
                              {formatDate(payment.paymentDeadline)}
                            </span>
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-0.5">
                        <p
                          className={cn(
                            "text-base font-semibold tabular-nums tracking-tight",
                            isUnpaid
                              ? "text-foreground"
                              : "text-emerald-700 dark:text-emerald-400",
                          )}
                        >
                          {formatMoney(payment.amount)}
                        </p>
                        {!isUnpaid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            View item
                            <ArrowRight
                              className="size-3 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                              aria-hidden
                            />
                          </span>
                        ) : null}
                      </div>
                    </Link>

                    {isUnpaid ? (
                      <Button
                        type="button"
                        size="sm"
                        className="h-9 gap-1.5 px-3.5 shadow-sm shadow-primary/25"
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
