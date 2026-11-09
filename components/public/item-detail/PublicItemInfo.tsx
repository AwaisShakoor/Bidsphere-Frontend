"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Clock, Gavel, Trophy, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuctionStatus } from "@/enums/auctionStatus";
import { BidStatus } from "@/enums/bidStatus";
import { getItemConditionBadgeClass } from "@/enums/itemCondition";
import { formatDate, formatMoney, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useItemBids, usePlaceBid } from "@/services/hooks/BidServicesHook";
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
  const isLive = item.auction.status.toUpperCase() === AuctionStatus.LIVE;
  const isWinner = Boolean(userId && item.winnerId === userId);

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
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {item.title || "Untitled"}
        </h1>
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
      ) : isWinner ? (
        <div className="mt-auto overflow-hidden rounded-xl border border-emerald-500/30 bg-linear-to-br from-emerald-500/15 via-emerald-500/8 to-card p-4 shadow-sm shadow-emerald-500/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-300">
                <Trophy className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  You won this item
                </p>
                <p className="text-xs text-muted-foreground">
                  Congratulations — your bid took it.
                </p>
              </div>
            </div>
            {item.currentBid ? (
              <div className="inline-flex shrink-0 flex-col items-center justify-center rounded-lg bg-emerald-500/15 px-4 py-2 text-center ring-1 ring-emerald-500/25">
                <p className="text-[10px] font-semibold tracking-wide text-emerald-700/80 uppercase dark:text-emerald-400/80">
                  Winning bid
                </p>
                <p className="text-base font-bold leading-tight text-emerald-800 tabular-nums dark:text-emerald-300">
                  {formatMoney(item.currentBid)}
                </p>
              </div>
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
