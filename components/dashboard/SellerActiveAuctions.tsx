"use client";

import Link from "next/link";
import { ArrowRight, Gavel, ImageIcon, Inbox } from "lucide-react";
import { AuctionCardsSkeleton } from "@/components/auction/AuctionCardsSkeleton";
import { Button } from "@/components/ui/button";
import { AuctionStatus } from "@/enums/auctionStatus";
import { getAuctionStatusClass } from "@/lib/constants/auctionStatus";
import { formatDate, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAuctions } from "@/services/hooks/AuctionServicesHook";
import { useItems } from "@/services/hooks/ItemServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";

function getCoverUrl(images: { url: string; sortOrder: number }[]) {
  return [...images].sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url ?? null;
}

function ActiveAuctionCard({
  auction,
  href,
}: {
  auction: Auction;
  href: string;
}) {
  const { data: items = [], isPending } = useItems(auction.id);
  const coverUrl = items[0] ? getCoverUrl(items[0].images) : null;

  return (
    <li>
      <Link
        href={href}
        className="block h-full overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border transition-all hover:-translate-y-0.5 hover:ring-primary/30 hover:shadow-md hover:shadow-primary/10"
      >
        <div className="relative aspect-video overflow-hidden bg-muted">
          {isPending ? (
            <div className="size-full animate-pulse bg-muted" />
          ) : coverUrl ? (
            <img
              src={coverUrl}
              alt={auction.title || "Auction cover"}
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-muted-foreground">
              <ImageIcon className="size-6" aria-hidden />
            </span>
          )}
          <span
            className={cn(
              "absolute top-2 right-2 rounded-md px-2 py-0.5 text-[11px] font-medium shadow-sm",
              getAuctionStatusClass(auction.status),
            )}
          >
            {formatSnakeCase(auction.status)}
          </span>
        </div>

        <div className="p-3.5">
          <p className="truncate text-sm font-semibold tracking-tight text-foreground">
            {auction.title || "Untitled"}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {auction.description || "No description"}
          </p>
          <div className="mt-3 flex items-end justify-between gap-2 text-[11px] text-muted-foreground">
            <div>
              <p>Starts</p>
              <p className="mt-0.5 font-medium text-foreground">
                {formatDate(auction.startTime)}
              </p>
            </div>
            <div className="text-right">
              <p>Ends</p>
              <p className="mt-0.5 font-medium text-foreground">
                {formatDate(auction.endTime)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

export function SellerActiveAuctions({ isSeller = false }: { isSeller?: boolean }) {
  const { data: auctions = [], isPending, isError, error } = useAuctions();

  const activeAuctions = auctions.filter(
    (auction) => auction.status?.toUpperCase() === AuctionStatus.ACTIVE,
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {isSeller ? "Your active auctions" : "Live auctions"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSeller
              ? "Live listings currently open on the marketplace."
              : "Auctions currently open for bidding."}
          </p>
        </div>
        {isSeller ? (
          <Button
            type="button"
            size="sm"
            className="h-10 w-fit gap-1.5 rounded-lg px-3 shadow-sm shadow-primary/10"
            asChild
          >
            <Link href="/my-auctions">
              <Gavel className="size-3.5" aria-hidden />
              Manage auctions
              <ArrowRight className="size-3.5 opacity-80" aria-hidden />
            </Link>
          </Button>
        ) : null}
      </div>

      {isPending ? <AuctionCardsSkeleton /> : null}

      {isError ? (
        <p className="text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Could not load auctions."}
        </p>
      ) : null}

      {!isPending && !isError && activeAuctions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm shadow-primary/5">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Inbox className="size-5" aria-hidden />
          </span>
          <div className="space-y-1.5">
            <p className="text-base font-semibold tracking-tight text-foreground">
              No auctions yet
            </p>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
              {isSeller
                ? "Create your first auction to list items, set a schedule, and submit it for approval. Active auctions will show up here."
                : "There are no live auctions right now. Check back soon — new listings will appear here when they go live."}
            </p>
          </div>
          {isSeller ? (
            <div className="pt-1">
              <Button
                type="button"
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-3 shadow-sm shadow-primary/10"
                asChild
              >
                <Link href="/my-auctions">
                  <Gavel className="size-3.5" aria-hidden />
                  Go to my auctions
                  <ArrowRight className="size-3.5 opacity-80" aria-hidden />
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      {!isPending && !isError && activeAuctions.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeAuctions.map((auction) => (
            <ActiveAuctionCard
              key={auction.id}
              auction={auction}
              href={
                isSeller
                  ? `/my-auctions?id=${auction.id}`
                  : `/dashboard`
              }
            />
          ))}
        </ul>
      ) : null}
    </section>
  );
}
