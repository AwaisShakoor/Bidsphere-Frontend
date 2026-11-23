"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Inbox, Package, Truck } from "lucide-react";
import { ShipItemForm } from "@/components/shipping";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListPagination } from "@/components/ui/ListPagination";
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
  getDefaultPayoutTab,
  getPayoutsByTab,
  getPayoutTabEmptyMessage,
  PAYOUT_TABS,
  type PayoutTab,
} from "@/lib/myPayouts";
import { getPagedItems } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { useMyPayouts } from "@/services/hooks/PayoutServicesHook";

export function SellerPayoutsHistory() {
  const { data: payouts = [], isPending, isError, error } = useMyPayouts();
  const [selectedTab, setSelectedTab] = useState<PayoutTab | null>(null);
  const [page, setPage] = useState(0);
  const tab = selectedTab ?? getDefaultPayoutTab(payouts);

  const awaitingPayment = getPayoutsByTab(payouts, "pending");
  const toShip = getPayoutsByTab(payouts, "to_ship");
  const transferPending = getPayoutsByTab(payouts, "transfer_pending");
  const paid = getPayoutsByTab(payouts, "paid");
  const list = getPayoutsByTab(payouts, tab);
  const { pageItems, currentPage } = getPagedItems(list, page);

  const items: MoneyListItem[] = pageItems.map((payout) => {
    const paidOut = isPayoutPaid(payout.status, payout.paidAt);
    const isTransferPending = isPayoutTransferPending(payout);
    const statusLabel = getPayoutHistoryLabel(payout);
    const title = payout.item?.title || "Untitled item";
    const buyerName = [payout.buyer?.firstName, payout.buyer?.lastName]
      .filter(Boolean)
      .join(" ");
    const isAwaitingShipment = statusLabel === "Awaiting shipment";
    const isShipped = statusLabel === "Shipped";
    const isDelivered = statusLabel === "Delivered";

    let notice: { text: string; className: string } | null = null;

    if (isAwaitingShipment) {
      notice = {
        text: "Action needed: ship this item. Payout is held until the buyer confirms delivery.",
        className:
          "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
      };
    } else if (isShipped) {
      notice = {
        text: "Waiting for buyer to confirm delivery — payout stays held until then.",
        className:
          "border-sky-500/30 bg-sky-500/10 text-sky-900 dark:text-sky-200",
      };
    } else if (isDelivered) {
      notice = {
        text: "Buyer confirmed delivery. Payout release is processing.",
        className:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200",
      };
    } else if (isTransferPending) {
      notice = {
        text: "Buyer paid. Payout to your bank is still processing.",
        className:
          "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
      };
    }

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
      hint: isAwaitingShipment ? "View item" : statusLabel,
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
          </p>
          {payout.trackingNote ? (
            <p className="mt-1 truncate text-[11px] text-muted-foreground">
              Note: {payout.trackingNote}
            </p>
          ) : null}
          {notice ? (
            <p
              className={cn(
                "mt-2 inline-flex max-w-full items-start gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-semibold leading-snug",
                notice.className,
              )}
            >
              {isAwaitingShipment ? (
                <Package className="mt-0.5 size-3 shrink-0" aria-hidden />
              ) : isShipped ? (
                <Truck className="mt-0.5 size-3 shrink-0" aria-hidden />
              ) : (
                <Clock className="mt-0.5 size-3 shrink-0" aria-hidden />
              )}
              <span>{notice.text}</span>
            </p>
          ) : null}
        </>
      ),
      below: isAwaitingShipment ? (
        <ShipItemForm itemId={payout.item.id} compact />
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
              to_ship: toShip.length,
              transfer_pending: transferPending.length,
              paid: paid.length,
            }}
            onChange={(value) => {
              setSelectedTab(value as PayoutTab);
              setPage(0);
            }}
          />
          <p className="text-[11px] text-muted-foreground">
            Amounts are after platform fee
          </p>
        </div>
      }
      emptyTab={getPayoutTabEmptyMessage(tab)}
      items={items}
      footer={
        <ListPagination
          page={currentPage}
          total={list.length}
          onPageChange={setPage}
        />
      }
    />
  );
}
