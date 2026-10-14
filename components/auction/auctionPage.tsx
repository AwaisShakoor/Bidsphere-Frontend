"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { AuctionList } from "@/components/auction/auctionList";
import { AuctionSearchInput } from "@/components/auction/auctionSearchInput";
import { AuctionSortSelect } from "@/components/auction/auctionSortSelect";
import { AuctionStatusSelect } from "@/components/auction/auctionStatusSelect";
import { CreateAuctionForm } from "@/components/auction/createAuctionForm";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_AUCTION_SORT,
  type AuctionSortValue,
} from "@/enums/auctionSort";
import {
  DEFAULT_AUCTION_STATUS,
  type AuctionStatusValue,
} from "@/enums/auctionStatus";
import {
  filterAuctionsByStatus,
  filterAuctionsByTitle,
} from "@/lib/auctionFilter";
import { sortAuctions } from "@/lib/auctionSort";
import { useMyAuctions } from "@/services/hooks/AuctionServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";

export function AuctionPage() {
  const {
    data: myAuctions = [],
    isLoading,
    isError,
  } = useMyAuctions();
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AuctionStatusValue>(
    DEFAULT_AUCTION_STATUS,
  );
  const [sort, setSort] = useState<AuctionSortValue>(DEFAULT_AUCTION_SORT);
  const visibleAuctions = sortAuctions(
    filterAuctionsByStatus(
      filterAuctionsByTitle(myAuctions, search),
      status,
    ),
    sort,
  );

  function handleCreate() {
    setSelectedAuction(null);
    setView("form");
  }

  function handleEdit(auction: Auction) {
    setSelectedAuction(auction);
    setView("form");
  }

  function handleBackToList() {
    setSelectedAuction(null);
    setView("list");
  }

  if (view === "form") {
    return (
      <main className="relative flex-1 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-primary/8 blur-3xl"
        />
        <div className="app-container relative py-8 sm:py-10">
          <CreateAuctionForm
            auction={selectedAuction ?? undefined}
            onBack={handleBackToList}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-primary/8 blur-3xl"
      />

      <div className="app-container relative flex flex-col gap-6 py-8 sm:py-10">
        <Link
          href="/dashboard"
          className="inline-flex w-fit cursor-pointer items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium tracking-wide text-primary uppercase">
              Seller
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              My auctions
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Create new auctions or edit existing ones from this list.
            </p>
          </div>

          <Button
            type="button"
            className="h-11 gap-2 px-5"
            onClick={handleCreate}
          >
            <Plus className="size-4" />
            Create auction
          </Button>
        </section>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <AuctionSearchInput value={search} onChange={setSearch} />
              <AuctionStatusSelect value={status} onChange={setStatus} />
            </div>
            <AuctionSortSelect value={sort} onChange={setSort} />
          </div>
          <AuctionList
            auctions={visibleAuctions}
            isLoading={isLoading}
            isError={isError}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </main>
  );
}
