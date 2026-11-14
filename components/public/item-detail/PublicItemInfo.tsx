"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Gavel,
  Trophy,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuctionStatus } from "@/enums/auctionStatus";
import { BidStatus } from "@/enums/bidStatus";
import { getItemConditionBadgeClass } from "@/enums/itemCondition";
import { PaymentStatus } from "@/enums/paymentStatus";
import { formatDate, formatMoney, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useItemBids, usePlaceBid } from "@/services/hooks/BidServicesHook";
import { useItemPayment } from "@/services/hooks/PaymentServicesHook";
import type { PublicItem } from "@/services/types/ItemsServicesTypes";
import { PlaceBidPulse } from "./PublicItemDetailSkeleton";

type PublicItemInfoProps = {
  item: PublicItem;
  itemId: string;
  userId: string | null;
  isLoggedIn: boolean;
  isAuthPending: boolean;
};

export function PublicItemInfo({
  item,
  itemId,
  userId,
  isLoggedIn,
  isAuthPending,
}: PublicItemInfoProps) {
  const router = useRouter();
  const { data: bids = [] } = useItemBids(itemId);
  const { mutate: placeBid, isPending: isPlacingBid } = usePlaceBid();
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const price = item.currentBid ?? item.startingPrice;
  const bidLabel = item.currentBid ? "Current bid" : "Starting bid";
  const startingPrice = Number(item.startingPrice ?? 0);
  const currentBid = item.currentBid != null ? Number(item.currentBid) : null;
  const leadingBid =
    bids.find((bid) => bid.status === BidStatus.ACTIVE) ?? bids[0];
  const isLeadingBidder = Boolean(userId && leadingBid?.bidder.id === userId);
  const auctionStatus = item.auction.status.toUpperCase();
  const isLive = auctionStatus === AuctionStatus.LIVE;
  const isAuctionOver =
    auctionStatus === AuctionStatus.ENDED ||
    auctionStatus === AuctionStatus.COMPLETED;
  const isWinner = Boolean(userId && item.winnerId === userId);
  const { data: fetchedPayment } = useItemPayment(
    itemId,
    isWinner && isAuctionOver && !item.payment,
  );
  const payment = item.payment ?? fetchedPayment;
  const isPaid = payment?.status?.toUpperCase() === PaymentStatus.COMPLETED;
  const showPayNow = isWinner && isAuctionOver && !isPaid;

  function handleLoginToBid() {
    router.push(`/login?next=${encodeURIComponent(`/items/${itemId}`)}`);
  }

  function handlePlaceBid(event: FormEvent) {
    event.preventDefault();
    if (!isLive || isLeadingBidder) return;

    const amount = Number(bidAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setBidError("Enter a valid bid amount.");
      return;
    }
    if (amount < startingPrice) {
      setBidError(`Bid must be at least ${formatMoney(item.startingPrice)}.`);
      return;
    }
    if (currentBid != null && amount <= currentBid) {
      setBidError(`Bid must be higher than ${formatMoney(item.currentBid)}.`);
      return;
    }

    setBidError("");
    placeBid(
      { itemId, amount },
      {
        onSuccess: () => setBidAmount(""),
      },
    );
  }

  return (
    <div className="flex flex-col gap-5 bg-linear-to-br from-accent/70 via-card to-card p-5 sm:p-6 lg:p-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold tracking-wide text-primary-foreground uppercase shadow-sm shadow-primary/20">
            {formatSnakeCase(item.auction.status)}
          </span>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-[11px] font-semibold",
              getItemConditionBadgeClass(item.itemCondition),
            )}
          >
            {formatSnakeCase(item.itemCondition)}
          </span>
          {item.category?.name ? (
            <span className="rounded-md border border-border/80 bg-background px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
              {item.category.name}
            </span>
          ) : null}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {item.title || "Untitled"}
        </h1>
        <p className="text-sm text-muted-foreground">
          <span className="text-[11px] font-semibold tracking-wide text-primary uppercase">
            Auction
          </span>
          <span className="mx-2 text-border">·</span>
          <span className="font-medium text-foreground">
            {item.auction.title || "Untitled auction"}
          </span>
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description || "No description"}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/10 px-3.5 py-2.5">
        <div className="flex items-baseline gap-2">
          <p className="text-lg font-bold tracking-tight text-primary">
            {formatMoney(price)}
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            {bidLabel}
          </p>
        </div>
        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Clock className="size-3.5 shrink-0 text-primary" aria-hidden />
          Ends {formatDate(item.auction.endTime)}
        </p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-3">
        <div className="rounded-xl border border-primary/15 bg-card/80 px-3.5 py-3">
          <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
            Starting
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {formatMoney(item.startingPrice)}
          </p>
        </div>
        <div className="rounded-xl border border-primary/15 bg-card/80 px-3.5 py-3">
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-primary uppercase">
            <Truck className="size-3" aria-hidden />
            Shipping
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {formatSnakeCase(item.shippingType)}
            {item.shippingCost ? ` · ${formatMoney(item.shippingCost)}` : ""}
          </p>
        </div>
        <div className="rounded-xl border border-primary/15 bg-card/80 px-3.5 py-3">
          <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
            Est. delivery
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {item.shippingEstimatedDays != null
              ? `${item.shippingEstimatedDays} day${item.shippingEstimatedDays === 1 ? "" : "s"}`
              : "—"}
          </p>
        </div>
      </div>

      {isAuthPending ? (
        <PlaceBidPulse />
      ) : isWinner && isAuctionOver ? (
        <div className="mt-auto overflow-hidden rounded-xl border border-emerald-500/25 bg-linear-to-br from-emerald-500/12 via-card to-card p-4 shadow-sm shadow-emerald-500/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-300">
                <Trophy className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  You won this item
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                  {item.currentBid ? (
                    <span className="font-semibold tabular-nums text-emerald-800 dark:text-emerald-300">
                      {formatMoney(item.currentBid)}
                    </span>
                  ) : null}
                  <span>{isPaid ? "Paid" : "Payment due"}</span>
                </div>
              </div>
            </div>

            {isPaid ? (
              <Button
                type="button"
                size="sm"
                className="h-8 w-fit gap-1.5 self-start px-3.5 shadow-sm shadow-primary/25 sm:self-center"
                asChild
              >
                <Link href="/my-payments">
                  <CheckCircle2 className="size-3.5" />
                  View payment
                </Link>
              </Button>
            ) : showPayNow ? (
              <Button
                type="button"
                size="sm"
                className="h-8 w-fit gap-1.5 self-start px-3.5 shadow-sm shadow-primary/25 sm:self-center"
                onClick={() => router.push(`/checkout/${itemId}`)}
              >
                <CreditCard className="size-3.5" />
                Pay now
              </Button>
            ) : null}
          </div>
        </div>
      ) : isLive && !isLoggedIn ? (
        <div className="mt-auto flex flex-col gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Sign in to place a bid on this item.
          </p>
          <Button
            type="button"
            size="lg"
            className="h-10 gap-2 px-4 shadow-sm shadow-primary/15"
            onClick={handleLoginToBid}
          >
            <Gavel className="size-4" />
            Log in to bid
          </Button>
        </div>
      ) : isLive && isLoggedIn ? (
        <form
          onSubmit={handlePlaceBid}
          noValidate
          className="mt-auto flex flex-col gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4"
        >
          <div className="space-y-1">
            <label
              htmlFor="bid-amount"
              className="text-sm font-medium text-foreground"
            >
              Your bid
            </label>
            <p className="text-xs text-muted-foreground">
              {isLeadingBidder
                ? "Your bid is active. You can bid again after someone else outbids you."
                : item.currentBid
                  ? `Must be higher than ${formatMoney(item.currentBid)}`
                  : `Starting bid is ${formatMoney(item.startingPrice)}`}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="bid-amount"
              type="number"
              inputMode="decimal"
              placeholder="Enter amount"
              value={bidAmount}
              onChange={(event) => {
                setBidAmount(event.target.value);
                setBidError("");
              }}
              disabled={isLeadingBidder || isPlacingBid}
              aria-invalid={Boolean(bidError)}
              className="h-10 bg-card"
            />
            <Button
              type="submit"
              size="lg"
              disabled={isLeadingBidder || isPlacingBid || !bidAmount}
              className="h-10 shrink-0 gap-2 px-4 shadow-sm shadow-primary/15"
            >
              <Gavel className="size-4" />
              {isPlacingBid
                ? "Placing…"
                : isLeadingBidder
                  ? "Active"
                  : "Place bid"}
            </Button>
          </div>
          {bidError ? (
            <p className="text-sm text-destructive" role="alert">
              {bidError}
            </p>
          ) : null}
        </form>
      ) : (
        <div className="mt-auto rounded-xl border border-border/80 bg-muted/40 p-4">
          <p className="text-sm font-medium text-foreground">
            Bidding is closed
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            This auction is {formatSnakeCase(item.auction.status).toLowerCase()}
            .
          </p>
        </div>
      )}
    </div>
  );
}
