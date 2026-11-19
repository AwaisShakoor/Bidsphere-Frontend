"use client";

import { useState } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  MoneyList,
  MoneyListTabs,
  type MoneyListItem,
} from "@/components/ui/MoneyList";
import { TruncatedText } from "@/components/ui/TruncatedText";
import {
  getPayoutHistoryLabel,
  getPayoutHistoryStatusClass,
  isPayoutPaid,
  isPayoutTransferPending,
} from "@/lib/constants/payoutHistoryStatus";
import { formatDate, formatMoney } from "@/lib/format";
import {
  getPayoutsByTab,
  getPayoutTabEmptyMessage,
  PAYOUT_TABS,
  type PayoutTab,
} from "@/lib/myPayouts";
import { useMyPayouts } from "@/services/hooks/PayoutServicesHook";

export function SellerPayoutsHistory() {
  const { data: payouts = [], isPending, isError, error } = useMyPayouts();
  const [tab, setTab] = useState<PayoutTab>("pending");
  const awaitingPayment = getPayoutsByTab(payouts, "pending");
  const transferPending = getPayoutsByTab(payouts, "transfer_pending");
  const paid = getPayoutsByTab(payouts, "paid");
  const list = getPayoutsByTab(payouts, tab);

  const items: MoneyListItem[] = list.map((payout) => {
    const paidOut = isPayoutPaid(payout.status, payout.paidAt);
    const isTransferPending = isPayoutTransferPending(
      payout.status,
      payout.stripeTransferId,
    );
    const statusLabel = getPayoutHistoryLabel(payout);
    const title = payout.item?.title || "Untitled item";
    const buyerName = [payout.buyer?.firstName, payout.buyer?.lastName]
      .filter(Boolean)
      .join(" ");

    return {
      id: payout.id,
      href: `/items/${payout.item.id}`,
      title,
      status: statusLabel,
      statusClassName: getPayoutHistoryStatusClass(payout),
      amount: formatMoney(payout.sellerPayout),
      tone:
        statusLabel === "Failed"
          ? "destructive"
          : statusLabel === "Paid"
            ? "emerald"
            : "amber",
      hint: statusLabel,
      description: (
        <>
          <p className="mt-1 flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
            <TruncatedText
              as="span"
              text={payout.auction?.title || "Auction"}
              limit={36}
              className="max-w-48"
            />
            {buyerName ? (
              <>
                <span className="text-border">·</span>
                <TruncatedText
                  as="span"
                  text={buyerName}
                  limit={28}
                  className="max-w-40"
                />
              </>
            ) : null}
            <span className="text-border">·</span>
            <span>
              {paidOut
                ? `Paid ${formatDate(payout.paidAt ?? payout.createdAt)}`
                : `Created ${formatDate(payout.createdAt)}`}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Sale {formatMoney(payout.amount)} · Fee{" "}
            {formatMoney(payout.platformFee)}
            {isTransferPending
              ? " · Buyer paid, payout to your bank is still processing"
              : ""}
          </p>
        </>
      ),
    };
  });

  return (
    <MoneyList
      loading={isPending}
      error={
        isError
          ? error instanceof Error
            ? error.message
            : "Could not load payouts."
          : null
      }
      empty={
        payouts.length === 0 ? (
          <EmptyState
            icon={<Inbox className="size-5" aria-hidden />}
            title="No payouts yet"
            description="When buyers pay for your sold items, payouts will show up here."
            action={
              <Button type="button" size="sm" asChild>
                <Link href="/my-auctions">Go to Sell</Link>
              </Button>
            }
          />
        ) : null
      }
      header={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <MoneyListTabs
            label="Filter payouts"
            tabs={PAYOUT_TABS}
            value={tab}
            counts={{
              pending: awaitingPayment.length,
              transfer_pending: transferPending.length,
              paid: paid.length,
            }}
            onChange={(value) => setTab(value as PayoutTab)}
          />
          <p className="text-[11px] text-muted-foreground">
            Amounts are after platform fee
          </p>
        </div>
      }
      emptyTab={getPayoutTabEmptyMessage(tab)}
      items={items}
    />
  );
}
