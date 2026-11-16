"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Inbox,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { BidStatus } from "@/enums/bidStatus";
import {
  getBidAccentClass,
  getBidStatusClass,
} from "@/lib/constants/bidStatus";
import {
  formatDate,
  formatMoney,
  formatSnakeCase,
  titleInitial,
} from "@/lib/format";
import {
  getMyBidsEmptyMessage,
  getMyBidsView,
  MY_BIDS_PAGE_SIZE,
  type MyBidFilter,
} from "@/lib/myBids";
import { cn } from "@/lib/utils";
import { useMyBids } from "@/services/hooks/BidServicesHook";

export function MyBids() {
  const { data: bids = [], isPending, isError, error } = useMyBids();
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
  const wonCount = filters.find((item) => item.value === "won")?.count ?? 0;
  const activeCount =
    filters.find((item) => item.value === "active")?.count ?? 0;

  function handleFilterChange(next: MyBidFilter) {
    setFilter(next);
    setPage(0);
  }

  return (
    <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
      <div className="px-4 py-4 sm:px-5">
        {isPending ? (
          <div className="space-y-3">
            <div className="h-10 w-72 max-w-full animate-pulse rounded-xl bg-muted" />
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
        ) : isError ? (
          <p className="py-2 text-sm text-destructive">
            {error instanceof Error ? error.message : "Could not load bids."}
          </p>
        ) : bids.length === 0 ? (
          <div className="py-2">
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
          </div>
        ) : (
          <div className="space-y-4">
            {filter === "all" && wonCount > 0 ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-3.5 py-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    <Trophy className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {wonCount} won {wonCount === 1 ? "item" : "items"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Check My payments if checkout is still unpaid.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="h-9 gap-1.5 px-3.5 shadow-sm shadow-primary/25"
                  onClick={() => handleFilterChange("won")}
                >
                  <Trophy className="size-3.5" />
                  View wins
                  <ArrowRight className="size-3.5 opacity-80" />
                </Button>
              </div>
            ) : null}

            {filter === "all" && activeCount > 0 ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {activeCount} active {activeCount === 1 ? "bid" : "bids"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    You are currently the high bidder.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={() => handleFilterChange("active")}
                >
                  View active
                </Button>
              </div>
            ) : null}

            <div
              role="listbox"
              aria-label="Filter bids"
              className="inline-flex max-w-full flex-wrap rounded-xl border border-border/80 bg-muted/40 p-1"
            >
              {filters.map(({ value, label, count }) => (
                <button
                  key={value}
                  type="button"
                  role="option"
                  aria-selected={filter === value}
                  onClick={() => handleFilterChange(value)}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
                    filter === value
                      ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "tabular-nums",
                      filter === value ? "text-primary" : "opacity-70",
                    )}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {items.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {getMyBidsEmptyMessage(filter)}
              </p>
            ) : (
              <>
                <ul className="divide-y divide-border/70">
                  {pageItems.map((bid) => {
                    const status = bid.status.toUpperCase();
                    const isActive = status === BidStatus.ACTIVE;
                    const isWon = status === BidStatus.WON;
                    const title = bid.item.title || "Untitled";

                    return (
                      <li key={bid.id}>
                        <Link
                          href={`/items/${bid.item.id}`}
                          className={cn(
                            "group flex items-center gap-3 rounded-xl px-1.5 py-3.5 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-4 sm:px-2",
                            isActive && "bg-primary/5 hover:bg-primary/10",
                            isWon && "hover:bg-emerald-500/5",
                            !isActive && !isWon && "hover:bg-muted/50",
                          )}
                        >
                          <span
                            className={cn(
                              "inline-flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-semibold tracking-wide",
                              getBidAccentClass(bid.status),
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
                                  getBidStatusClass(bid.status),
                                )}
                              >
                                {formatSnakeCase(bid.status)}
                              </span>
                            </div>
                            <p className="mt-1 truncate text-xs text-muted-foreground">
                              {bid.item.auction.title}
                              <span className="mx-1.5 text-border">·</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock
                                  className="size-3 shrink-0 text-primary"
                                  aria-hidden
                                />
                                {isWon
                                  ? `Ended ${formatDate(bid.item.auction.endTime)}`
                                  : `Ends ${formatDate(bid.item.auction.endTime)}`}
                              </span>
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            <div className="text-right">
                              <p
                                className={cn(
                                  "text-base font-semibold tabular-nums tracking-tight",
                                  isWon
                                    ? "text-emerald-700 dark:text-emerald-400"
                                    : "text-foreground",
                                )}
                              >
                                {formatMoney(bid.amount)}
                              </p>
                              {isWon ? (
                                <p className="text-[11px] font-medium text-emerald-700/80 dark:text-emerald-400/80">
                                  Winning bid
                                </p>
                              ) : isActive ? (
                                <p className="text-[11px] text-primary">
                                  Your bid
                                </p>
                              ) : bid.item.currentBid ? (
                                <p className="text-[11px] text-muted-foreground tabular-nums">
                                  High {formatMoney(bid.item.currentBid)}
                                </p>
                              ) : null}
                            </div>
                            <ArrowRight
                              className="size-3.5 shrink-0 text-muted-foreground opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                              aria-hidden
                            />
                          </div>
                        </Link>
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
