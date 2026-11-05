"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Gavel, Inbox } from "lucide-react";
import { FilterEmptyState } from "@/components/marketplace/FilterEmptyState";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { MarketplaceCardsSkeleton } from "@/components/marketplace/MarketplaceCardsSkeleton";
import { MarketplaceFilterBar } from "@/components/marketplace/MarketplaceFilterBar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AuctionStatus } from "@/enums/auctionStatus";
import { getAuctionStatusClass } from "@/lib/constants/auctionStatus";
import { formatDate, formatSnakeCase } from "@/lib/format";
import { getPrimaryImage } from "@/lib/getPrimaryImage";
import { useAuctions } from "@/services/hooks/AuctionServicesHook";
import { useCategories } from "@/services/hooks/CategoryServicesHook";
import { useItems } from "@/services/hooks/ItemServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";

function ActiveAuctionCard({
  auction,
  href,
  categoryId,
}: {
  auction: Auction;
  href: string;
  categoryId: string;
}) {
  const { data: items = [], isPending } = useItems(auction.id);
  const coverUrl = getPrimaryImage(items[0]?.images)?.url ?? null;

  if (
    categoryId &&
    !isPending &&
    !items.some((item) => item.categoryId === categoryId)
  ) {
    return null;
  }

  return (
    <MarketplaceCard
      href={href}
      title={auction.title || "Untitled"}
      imageUrl={coverUrl}
      imagePending={isPending}
      badge={formatSnakeCase(auction.status)}
      badgeClassName={getAuctionStatusClass(auction.status)}
      footer={
        <>
          <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-3 shrink-0 text-primary" aria-hidden />
            Ends {formatDate(auction.endTime)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Starts {formatDate(auction.startTime)}
          </p>
        </>
      }
    />
  );
}

export function SellerActiveAuctions() {
  const { data: auctions = [], isPending, isError, error } = useAuctions();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data ?? [];
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const q = search.trim().toLowerCase();
  const activeAuctions = auctions.filter(
    (auction) => auction.status?.toUpperCase() === AuctionStatus.ACTIVE,
  );
  const filtered = activeAuctions.filter((auction) => {
    if (!q) return true;
    return (
      auction.title.toLowerCase().includes(q) ||
      auction.description.toLowerCase().includes(q)
    );
  });

  return (
    <section className="space-y-4">
      <MarketplaceFilterBar
        search={search}
        onSearchChange={setSearch}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        categories={categories}
        searchInputId="seller-auction-search"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Your active auctions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Live listings currently open on the marketplace.
          </p>
        </div>
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
      </div>

      {isPending ? <MarketplaceCardsSkeleton count={5} /> : null}

      {isError ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Could not load auctions."}
        </p>
      ) : null}

      {!isPending && !isError && activeAuctions.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-5" aria-hidden />}
          title="No active auctions"
          description="Create your first auction to list items, set a schedule, and submit it for approval. Active auctions will show up here."
          action={
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
          }
        />
      ) : null}

      {!isPending &&
      !isError &&
      activeAuctions.length > 0 &&
      filtered.length === 0 ? (
        <FilterEmptyState
          onClear={() => {
            setSearch("");
            setCategoryId("");
          }}
        />
      ) : null}

      {!isPending && !isError && filtered.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((auction) => (
            <ActiveAuctionCard
              key={auction.id}
              auction={auction}
              categoryId={categoryId}
              href={`/my-auctions?id=${auction.id}`}
            />
          ))}
        </ul>
      ) : null}
    </section>
  );
}
