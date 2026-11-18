"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleCheck, Clock, CreditCard, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDateRangeFilter } from "@/components/ui/DateRangeFilter";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  MoneyList,
  MoneyListTabs,
  type MoneyListItem,
} from "@/components/ui/MoneyList";
import { TruncatedText } from "@/components/ui/TruncatedText";
import {
  getPaymentDeadlineTone,
  getPaymentStatusClass,
  PAYMENT_DEADLINE_CLASS,
  PAYMENT_DEADLINE_LABEL,
} from "@/lib/constants/paymentStatus";
import { formatDate, formatMoney, formatSnakeCase } from "@/lib/format";
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
  const { dateRange, filter: dateRangeFilter } = useDateRangeFilter({
    "aria-label": "Filter payments by date",
  });
  const unpaid = getPaymentsByTab(payments, "unpaid", dateRange);
  const paid = getPaymentsByTab(payments, "paid", dateRange);
  const list = tab === "paid" ? paid : unpaid;

  const items: MoneyListItem[] = list.map((payment) => {
    const isUnpaid = tab === "unpaid";
    const title = payment.item?.title || "Untitled item";
    const deadlineTone = isUnpaid
      ? getPaymentDeadlineTone(payment.paymentDeadline)
      : null;

    let tone: MoneyListItem["tone"] = "emerald";
    if (isUnpaid) {
      tone = deadlineTone === "overdue" ? "destructive" : "amber";
    }

    return {
      id: payment.id,
      href: `/items/${payment.itemId}`,
      title,
      status: formatSnakeCase(payment.status),
      statusClassName: getPaymentStatusClass(payment.status),
      amount: formatMoney(payment.amount),
      tone,
      hint: isUnpaid ? undefined : "View item",
      description: (
        <>
          <p className="mt-1 flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
            <TruncatedText
              as="span"
              text={payment.auction?.title || "Auction"}
              limit={36}
              className="max-w-48"
            />
            {!isUnpaid ? (
              <>
                <span className="text-border">·</span>
                <span>Paid {formatDate(payment.paidAt ?? "")}</span>
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
              <span className="truncate font-medium tabular-nums">
                {formatDate(payment.paymentDeadline)}
              </span>
            </p>
          ) : null}
        </>
      ),
      action: isUnpaid ? (
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
      ) : null,
    };
  });

  return (
    <MoneyList
      loading={isPending}
      error={
        isError
          ? error instanceof Error
            ? error.message
            : "Could not load payments."
          : null
      }
      empty={
        payments.length === 0 ? (
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
        ) : null
      }
      header={
        <>
          {unpaid.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/8 px-3.5 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {unpaid.length} unpaid{" "}
                  {unpaid.length === 1 ? "item" : "items"}
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
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <MoneyListTabs
              label="Filter payments"
              tabs={PAYMENT_TABS}
              value={tab}
              counts={{ paid: paid.length, unpaid: unpaid.length }}
              onChange={(value) => setTab(value as PaymentTab)}
            />
            {dateRangeFilter}
          </div>
        </>
      }
      emptyTab={getPaymentTabEmptyMessage(tab)}
      items={items}
    />
  );
}
