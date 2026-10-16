"use client";

import { ArrowLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuction } from "@/services/hooks/AuctionServicesHook";

type AuctionDetailProps = {
  auctionId: string;
  onBack: () => void;
  onEditAuction: () => void;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function AuctionDetail({
  auctionId,
  onBack,
  onEditAuction,
}: AuctionDetailProps) {
  const { data: auction, isLoading, isError, error } = useAuction(auctionId);

  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-primary/8 blur-3xl"
      />

      <div className="app-container relative flex flex-col gap-8 py-8 sm:py-10">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          My auctions
        </button>

        {isLoading ? (
          <div className="rounded-2xl bg-card p-6 shadow-md shadow-primary/5 ring-1 ring-border">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-8 w-64 max-w-full animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
          </div>
        ) : isError || !auction ? (
          <p className="text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Could not load this auction."}
          </p>
        ) : (
          <section className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-md shadow-primary/5 ring-1 ring-border sm:flex-row sm:items-start sm:justify-between sm:p-6">
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium tracking-wide text-primary uppercase">
                  Auction
                </p>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {auction.status}
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {auction.title || "Untitled"}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {auction.description || "No description"}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Starts: </span>
                  {formatDate(auction.startTime)}
                </p>
                <p>
                  <span className="font-medium text-foreground">Ends: </span>
                  {formatDate(auction.endTime)}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-10 shrink-0 gap-1.5"
              onClick={onEditAuction}
            >
              <Pencil className="size-4" />
              Edit auction
            </Button>
          </section>
        )}
      </div>
    </main>
  );
}
