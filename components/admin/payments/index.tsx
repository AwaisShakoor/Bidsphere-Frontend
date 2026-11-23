"use client";

import { useMemo, useState } from "react";
import { Inbox, RotateCcw } from "lucide-react";
import { AdminPaymentsTable } from "./AdminPaymentsTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  useAdminPayments,
  useRefundAdminPayment,
} from "@/services/hooks/AdminServicesHook";
import type { AdminPayment } from "@/services/types/AdminServicesTypes";

type PaymentsFilter = "all" | "refundable";

export function AdminPayments() {
  const [filter, setFilter] = useState<PaymentsFilter>("all");
  const { data: payments = [], isPending, isError, error } = useAdminPayments();
  const { mutate: refundPayment, isPending: isRefunding } =
    useRefundAdminPayment();
  const [refundTarget, setRefundTarget] = useState<AdminPayment | null>(null);

  const list = useMemo(() => {
    if (filter === "refundable") {
      return payments.filter((payment) => payment.refundable === true);
    }
    return payments;
  }, [filter, payments]);

  function handleRefund() {
    if (!refundTarget) return;
    refundPayment(refundTarget.itemId, {
      onSuccess: () => setRefundTarget(null),
    });
  }

  const refundTitle =
    refundTarget?.item?.title || refundTarget?.itemId || "Item";

  return (
    <>
      <AdminPageHeader
        title="Payments"
        description="Review payments and issue refunds before shipping."
      />

      <div className="mb-3">
        <div
          role="tablist"
          aria-label="Filter payments"
          className="inline-flex rounded-xl border border-border/80 bg-muted/40 p-1"
        >
          {(
            [
              { value: "all", label: "All" },
              { value: "refundable", label: "Refund" },
            ] as const
          ).map((tab) => {
            const selected = filter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(tab.value)}
                className={cn(
                  "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  selected
                    ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {!isPending && !isError && list.length === 0 ? (
        <div className="rounded-2xl bg-card p-2 shadow-md shadow-primary/5 ring-1 ring-border">
          <EmptyState
            icon={<Inbox className="size-5" aria-hidden />}
            title={
              filter === "refundable" ? "Nothing to refund" : "No payments yet"
            }
            description={
              filter === "refundable"
                ? "Completed sales that have not shipped yet will show here."
                : "Paid item payments will show up here for review."
            }
          />
        </div>
      ) : (
        <AdminPaymentsTable
          key={filter}
          payments={list}
          isPending={isPending}
          isError={isError}
          error={error}
          onRefund={setRefundTarget}
          emptyTab={
            filter === "refundable"
              ? "Nothing to refund right now."
              : "No payments found."
          }
        />
      )}

      <DeleteConfirmationDialog
        open={Boolean(refundTarget)}
        name={refundTitle}
        title={`Refund “${refundTitle.trim() || "Item"}”?`}
        description={`Full refund of ${
          refundTarget ? formatMoney(refundTarget.amount) : formatMoney("0")
        }. Only allowed before the seller ships. This cannot be undone.`}
        confirmLabel="Refund payment"
        loadingLabel="Refunding…"
        icon={<RotateCcw className="size-4" />}
        isLoading={isRefunding}
        onConfirm={handleRefund}
        onClose={() => {
          if (!isRefunding) setRefundTarget(null);
        }}
      />
    </>
  );
}
