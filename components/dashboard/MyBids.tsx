"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { BidStatus, getBidStatusClass } from "@/enums/bidStatus";
import { PaymentStatus } from "@/enums/paymentStatus";
import { formatDate, formatMoney, formatSnakeCase } from "@/lib/format";
import {
  getMyBidsEmptyMessage,
  getMyBidsView,
  MY_BIDS_PAGE_SIZE,
  type MyBidFilter,
} from "@/lib/myBids";
import { cn } from "@/lib/utils";
import { useMyBids } from "@/services/hooks/BidServicesHook";
import { useMyPayments } from "@/services/hooks/PaymentServicesHook";
import type { Payment } from "@/services/types/PaymentServicesTypes";

function isItemPaid(payments: Payment[], itemId: string) {
  return payments.some(
    (payment) =>
      payment.itemId === itemId && payment.status === PaymentStatus.COMPLETED,
  );
}

export function MyBids() {
  const { data: bids = [], isPending, isError, error } = useMyBids();
  const { data: payments = [] } = useMyPayments();
  const [filter, setFilter] = useState<MyBidFilter>("all");
  const [page, setPage] = useState(0);
  const { items, filters } = getMyBidsView(bids, filter);

  const totalPages = Math.max(1, Math.ceil(items.length / MY_BIDS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageItems = items.slice(
    currentPage * MY_BIDS_PAGE_SIZE,
    currentPage * MY_BIDS_PAGE_SIZE + MY_BIDS_PAGE_SIZE,
  );
  const from = currentPage * MY_BIDS_PAGE_SIZE + 1;
  const to = Math.min(items.length, (currentPage + 1) * MY_BIDS_PAGE_SIZE);

  function handleFilterChange(next: MyBidFilter) {
    setFilter(next);
    setPage(0);
  }

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
            {error instanceof Error ? error.message : "Could not load bids."}
          </p>
        ) : bids.length === 0 ? (
          <EmptyState
            icon={<Inbox className="size-5" aria-hidden />}
            title="No bids yet"
            description="Browse live items on your dashboard to place your first bid."
            action={
              <Button type="button" size="sm" asChild>
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            <div
              role="listbox"
              aria-label="Filter bids"
              className="flex flex-wrap gap-1.5"
            >
              {filters.map(({ value, label, count }) => (
                <button
                  key={value}
                  type="button"
                  role="option"
                  aria-selected={filter === value}
                  onClick={() => handleFilterChange(value)}
                  className={cn(
                    "inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all",
                    filter === value
                      ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "border-border/80 bg-background text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                  )}
                >
                  {label}
                  <span className="tabular-nums opacity-80">{count}</span>
                </button>
              ))}
            </div>

            {items.length === 0 ? (
              <p className="py-5 text-center text-sm text-muted-foreground">
                {getMyBidsEmptyMessage(filter)}
              </p>
            ) : (
              <>
                <ul className="divide-y divide-border/70">
                  {pageItems.map((bid) => {
                    const status = bid.status.toUpperCase();
                    const isActive = status === BidStatus.ACTIVE;
                    const isWon = status === BidStatus.WON;

                    return (
                      <li key={bid.id}>
                        <div
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2 py-2.5 sm:gap-3",
                            isActive && "bg-primary/5",
                            isWon &&
                              "bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/20",
                          )}
                        >
                          <Link
                            href={`/items/${bid.item.id}`}
                            className={cn(
                              "group flex min-w-0 flex-1 items-center gap-3 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-4",
                            )}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                                <p className="truncate text-sm font-semibold text-foreground">
                                  {bid.item.title || "Untitled"}
                                </p>
                                <span
                                  className={cn(
                                    "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                                    getBidStatusClass(bid.status),
                                  )}
                                >
                                  {formatSnakeCase(bid.status)}
                                </span>
                              </div>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {bid.item.auction.title}
                                <span className="mx-1.5 text-border">·</span>
                                <span className="inline-flex items-center gap-1">
                                  <Clock
                                    className="size-3 shrink-0 text-primary"
                                    aria-hidden
                                  />
                                  Ends {formatDate(bid.item.auction.endTime)}
                                </span>
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                              <div className="text-right">
                                <p
                                  className={cn(
                                    "text-sm font-semibold tabular-nums",
                                    isWon
                                      ? "text-emerald-700 dark:text-emerald-400"
                                      : "text-primary",
                                  )}
                                >
                                  {formatMoney(bid.amount)}
                                </p>
                                {!isActive && bid.item.currentBid ? (
                                  <p className="text-[11px] text-muted-foreground tabular-nums">
                                    High {formatMoney(bid.item.currentBid)}
                                  </p>
                                ) : null}
                              </div>
                              {!isWon ? (
                                <ArrowRight
                                  className="size-3.5 shrink-0 text-muted-foreground opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                                  aria-hidden
                                />
                              ) : null}
                            </div>
                          </Link>

                          {isWon ? (
                            isItemPaid(payments, bid.item.id) ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1.5 border-emerald-500/25 bg-emerald-500/5 text-emerald-800 hover:bg-emerald-500/10 dark:text-emerald-300"
                                asChild
                              >
                                <Link href="/my-payments">
                                  <CheckCircle2 className="size-3.5" />
                                  Paid
                                </Link>
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                className="h-8 gap-1.5 px-3 shadow-sm shadow-primary/25"
                                asChild
                              >
                                <Link href={`/checkout/${bid.item.id}`}>
                                  <CreditCard className="size-3.5" />
                                  Pay now
                                </Link>
                              </Button>
                            )
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {items.length > MY_BIDS_PAGE_SIZE ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-muted-foreground tabular-nums">
                      Showing {from}–{to} of {items.length}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        disabled={currentPage === 0}
                        onClick={() => setPage(Math.max(0, currentPage - 1))}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <p className="min-w-16 text-center text-xs font-medium text-muted-foreground tabular-nums">
                        {currentPage + 1} / {totalPages}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        disabled={currentPage >= totalPages - 1}
                        onClick={() =>
                          setPage(Math.min(totalPages - 1, currentPage + 1))
                        }
                        aria-label="Next page"
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
