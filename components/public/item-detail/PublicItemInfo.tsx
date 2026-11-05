"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Clock, Gavel, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getItemConditionBadgeClass } from "@/enums/itemCondition";
import { formatDate, formatMoney, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import { usePlaceBid } from "@/services/hooks/BidServicesHook";
import type { PublicItem } from "@/services/types/ItemsServicesTypes";
import { PlaceBidPulse } from "./PublicItemDetailSkeleton";

type PublicItemInfoProps = {
  item: PublicItem;
  itemId: string;
  isLoggedIn: boolean;
  isAuthPending: boolean;
};

export function PublicItemInfo({
  item,
  itemId,
  isLoggedIn,
  isAuthPending,
}: PublicItemInfoProps) {
  const router = useRouter();
  const { mutate: placeBid, isPending: isPlacingBid } = usePlaceBid();
  const [bidAmount, setBidAmount] = useState("");
  const price = item.currentBid ?? item.startingPrice;
  const bidLabel = item.currentBid ? "Current bid" : "Starting bid";
  const minBid = Number(item.currentBid ?? item.startingPrice ?? 0);

  function handleLoginToBid() {
    router.push(`/login?next=${encodeURIComponent(`/items/${itemId}`)}`);
  }

  function handlePlaceBid(event: FormEvent) {
    event.preventDefault();
    const amount = Number(bidAmount);
    if (!Number.isFinite(amount) || amount <= 0) return;

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
            Active
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

      <div className="grid gap-2.5 sm:grid-cols-2">
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
      </div>

      {isAuthPending ? (
        <PlaceBidPulse />
      ) : !isLoggedIn ? (
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
      ) : (
        <form
          onSubmit={handlePlaceBid}
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
              {item.currentBid
                ? `Must be higher than ${formatMoney(item.currentBid)}`
                : `Starting bid is ${formatMoney(item.startingPrice)}`}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="bid-amount"
              type="number"
              min={minBid || undefined}
              step="1"
              inputMode="decimal"
              placeholder="Enter amount"
              value={bidAmount}
              onChange={(event) => setBidAmount(event.target.value)}
              required
              className="h-10 bg-card"
            />
            <Button
              type="submit"
              size="lg"
              disabled={isPlacingBid || !bidAmount}
              className="h-10 shrink-0 gap-2 px-4 shadow-sm shadow-primary/15"
            >
              <Gavel className="size-4" />
              {isPlacingBid ? "Placing…" : "Place bid"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
