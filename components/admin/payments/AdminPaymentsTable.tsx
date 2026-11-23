"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListPagination } from "@/components/ui/ListPagination";
import { MoneyList, type MoneyListItem } from "@/components/ui/MoneyList";
import { TruncatedText } from "@/components/ui/TruncatedText";
import { RefundReason } from "@/components/payments/RefundReason";
import {
  getDeliveryStatusClass,
  getDeliveryStatusLabel,
} from "@/lib/constants/deliveryStatus";
import { getPaymentStatusClass } from "@/lib/constants/paymentStatus";
import { formatDate, formatMoney, formatSnakeCase } from "@/lib/format";
import { getPagedItems } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import type { AdminPayment } from "@/services/types/AdminServicesTypes";

type AdminPaymentsTableProps = {
  payments: AdminPayment[];
  isPending?: boolean;
  isError?: boolean;
  error?: Error | null;
  emptyTab?: string;
  onRefund: (payment: AdminPayment) => void;
};

export function AdminPaymentsTable({
  payments,
  isPending = false,
  isError = false,
  error = null,
  emptyTab = "No payments in this filter.",
  onRefund,
}: AdminPaymentsTableProps) {
  const [page, setPage] = useState(0);
  const { pageItems, currentPage } = getPagedItems(payments, page);

  const items: MoneyListItem[] = pageItems.map((payment) => {
    const title = payment.item?.title || "Untitled item";
    const deliveryLabel = getDeliveryStatusLabel(payment.deliveryStatus);
    const refundable = payment.refundable === true;
    const buyerName = [payment.buyer?.firstName, payment.buyer?.lastName]
      .filter(Boolean)
      .join(" ");

    let tone: MoneyListItem["tone"] = "emerald";
    if (payment.status.toUpperCase() === "REFUNDED") {
      tone = "destructive";
    } else if (refundable) {
      tone = "amber";
    }

    return {
      id: payment.id,
      href: `/items/${payment.itemId}`,
      title,
      status: formatSnakeCase(payment.status),
      statusClassName: getPaymentStatusClass(payment.status),
      amount: formatMoney(payment.amount),
      tone,
      hint: undefined,
      description: (
        <>
          <p className="mt-1 flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
            {buyerName ? (
              <TruncatedText
                as="span"
                text={buyerName}
                limit={28}
                className="max-w-40"
              />
            ) : (
              <span>Buyer</span>
            )}
            {deliveryLabel ? (
              <>
                <span className="text-border">·</span>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                    getDeliveryStatusClass(payment.deliveryStatus),
                  )}
                >
                  {deliveryLabel}
                </span>
              </>
            ) : null}
            {payment.paidAt ? (
              <>
                <span className="text-border">·</span>
                <span>Paid {formatDate(payment.paidAt)}</span>
              </>
            ) : null}
          </p>
          {payment.refundRequestedAt ? (
            <div className="mt-1.5 space-y-1.5">
              <p className="text-[11px] font-medium text-amber-800 dark:text-amber-200">
                Buyer requested refund {formatDate(payment.refundRequestedAt)}
              </p>
              {payment.refundRequestReason ? (
                <RefundReason reason={payment.refundRequestReason} />
              ) : null}
            </div>
          ) : null}
        </>
      ),
      action: refundable ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 shrink-0 gap-1.5 border-destructive/25 px-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onRefund(payment)}
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Refund
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
      emptyTab={emptyTab}
      items={items}
      footer={
        payments.length > 0 ? (
          <ListPagination
            page={currentPage}
            total={payments.length}
            onPageChange={setPage}
          />
        ) : null
      }
    />
  );
}
