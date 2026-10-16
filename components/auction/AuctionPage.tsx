"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { AuctionDetail } from "@/components/auction/AuctionDetail";
import { AuctionForm } from "@/components/auction/AuctionForm";
import { AuctionList } from "@/components/auction/AuctionList";
import { Button } from "@/components/ui/button";
import {
  useAuction,
  useAuctions,
} from "@/services/hooks/AuctionServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";

type AuctionView = "list" | "detail" | "form";

export function AuctionPage() {
  const { data: auctions = [], isLoading } = useAuctions();
  const [view, setView] = useState<AuctionView>("list");
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(
    null,
  );
  const { data: selectedAuction } = useAuction(
    view === "form" ? selectedAuctionId : null,
  );

  function handleCreateAuction() {
    setSelectedAuctionId(null);
    setView("form");
  }

  function handleOpenAuction(auction: Auction) {
    setSelectedAuctionId(auction.id);
    setView("detail");
  }

  function handleEditAuction(auction?: Auction) {
    if (auction) setSelectedAuctionId(auction.id);
    setView("form");
  }

  function handleBackToList() {
    setSelectedAuctionId(null);
    setView("list");
  }

  function handleBackFromForm() {
    if (selectedAuctionId) {
      setView("detail");
      return;
    }
    handleBackToList();
  }

  if (view === "form") {
    return (
      <main className="relative flex-1 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-primary/8 blur-3xl"
        />

        <div className="app-container relative mx-auto flex w-full max-w-2xl flex-col gap-6 py-8 sm:py-10">
          <button
            type="button"
            onClick={handleBackFromForm}
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {selectedAuctionId ? "Back to auction" : "My auctions"}
          </button>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {selectedAuctionId ? "Edit auction" : "Add auction"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {selectedAuctionId
                ? "Update the title, description, and schedule."
                : "Set the title, description, and schedule. Items can be added later."}
            </p>
          </div>

          <div className="rounded-2xl bg-card px-6 py-8 shadow-xl shadow-primary/10 ring-1 ring-border sm:px-8">
            {selectedAuctionId && !selectedAuction ? (
              <p className="text-sm text-muted-foreground">Loading auction...</p>
            ) : (
              <AuctionForm
                auction={selectedAuction}
                onBack={handleBackFromForm}
              />
            )}
          </div>
        </div>
      </main>
    );
  }

  if (view === "detail" && selectedAuctionId) {
    return (
      <AuctionDetail
        auctionId={selectedAuctionId}
        onBack={handleBackToList}
        onEditAuction={() => handleEditAuction()}
      />
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
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
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
              Click an auction to open it.
            </p>
          </div>

          <Button
            type="button"
            className="h-11 gap-2 px-5"
            onClick={handleCreateAuction}
          >
            <Plus className="size-4" />
            Create auction
          </Button>
        </section>

        <AuctionList
          auctions={auctions}
          isLoading={isLoading}
          onOpenAuction={handleOpenAuction}
          onEditAuction={handleEditAuction}
        />
      </div>
    </main>
  );
}
