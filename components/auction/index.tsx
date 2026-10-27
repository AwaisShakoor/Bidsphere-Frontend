"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { AuctionDetail } from "./AuctionDetail";
import { AuctionForm } from "./AuctionForm";
import { AuctionTable } from "./AuctionTable";
import { ItemDetail, ItemForm } from "@/components/item";
import { Button } from "@/components/ui/button";
import { useAuctions } from "@/services/hooks/AuctionServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";
import type { Item } from "@/services/types/ItemsServicesTypes";

export { AuctionTable } from "./AuctionTable";

export function AuctionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auctionId = searchParams.get("id");
  const itemId = searchParams.get("itemId");

  const [editingAuction, setEditingAuction] = useState<Auction | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingItem, setIsCreatingItem] = useState(false);

  const { data: auctions = [], isPending } = useAuctions();

  const showAuctionForm = isCreating || editingAuction !== null;
  const showItemForm = isCreatingItem || editingItem !== null;

  function goToList() {
    setIsCreating(false);
    setEditingAuction(null);
    setIsCreatingItem(false);
    setEditingItem(null);
    router.push("/my-auctions");
  }

  function handleCreateAuction() {
    setEditingAuction(null);
    setIsCreatingItem(false);
    setEditingItem(null);
    setIsCreating(true);
  }

  function handleOpenAuction(auction: Auction) {
    setIsCreating(false);
    setEditingAuction(null);
    setIsCreatingItem(false);
    setEditingItem(null);
    router.push(`/my-auctions?id=${auction.id}`);
  }

  function handleEditAuction(auction: Auction) {
    setIsCreating(false);
    setIsCreatingItem(false);
    setEditingItem(null);
    setEditingAuction(auction);
  }

  function handleBackFromForm() {
    setIsCreating(false);
    setEditingAuction(null);
    setIsCreatingItem(false);
    setEditingItem(null);
  }

  function handleAddItem() {
    setIsCreating(false);
    setEditingAuction(null);
    setEditingItem(null);
    setIsCreatingItem(true);
  }

  function handleEditItem(item: Item) {
    setIsCreating(false);
    setEditingAuction(null);
    setIsCreatingItem(false);
    setEditingItem(item);
  }

  function handleOpenItem(nextItemId: string) {
    if (!auctionId) return;
    setIsCreating(false);
    setEditingAuction(null);
    setIsCreatingItem(false);
    setEditingItem(null);
    router.push(`/my-auctions?id=${auctionId}&itemId=${nextItemId}`);
  }

  function handleBackFromItem() {
    if (!auctionId) return;
    setEditingItem(null);
    router.push(`/my-auctions?id=${auctionId}`);
  }

  if (showItemForm && auctionId) {
    const isEdit = editingItem !== null;

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
            className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {itemId || isEdit ? "Back to item" : "Back to auction"}
          </button>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isEdit ? "Edit item" : "Add item"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEdit
                ? "Update the details, pricing, and images for this lot."
                : "Set the title, pricing, condition, and shipping for this lot."}
            </p>
          </div>

          <div className="rounded-2xl bg-card px-6 py-8 shadow-xl shadow-primary/10 ring-1 ring-border sm:px-8">
            <ItemForm
              auctionId={auctionId}
              item={editingItem ?? undefined}
              onClose={handleBackFromForm}
            />
          </div>
        </div>
      </main>
    );
  }

  if (auctionId && itemId) {
    return (
      <ItemDetail
        auctionId={auctionId}
        itemId={itemId}
        onBack={handleBackFromItem}
      />
    );
  }

  if (showAuctionForm) {
    const isEdit = editingAuction !== null;

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
            className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {auctionId ? "Back to auction" : "My auctions"}
          </button>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isEdit ? "Edit auction" : "Add auction"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEdit
                ? "Update the title, description, and schedule."
                : "Set the title, description, and schedule. Items can be added later."}
            </p>
          </div>

          <div className="rounded-2xl bg-card px-6 py-8 shadow-xl shadow-primary/10 ring-1 ring-border sm:px-8">
            <AuctionForm
              auction={editingAuction ?? undefined}
              onBack={handleBackFromForm}
            />
          </div>
        </div>
      </main>
    );
  }

  if (auctionId) {
    return (
      <AuctionDetail
        auctionId={auctionId}
        onBack={goToList}
        onAddItem={handleAddItem}
        onOpenItem={handleOpenItem}
        onEditItem={handleEditItem}
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

        <AuctionTable
          auctions={auctions}
          isPending={isPending}
          onOpenAuction={handleOpenAuction}
          onEditAuction={handleEditAuction}
          onCreateAuction={handleCreateAuction}
        />
      </div>
    </main>
  );
}
