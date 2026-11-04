"use client";

import { useState } from "react";
import { Clock, Gavel } from "lucide-react";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { MarketplaceFilterBar } from "@/components/marketplace/MarketplaceFilterBar";
import { PublicActiveItemsSkeleton } from "@/components/public/PublicActiveItemsSkeleton";
import { Button } from "@/components/ui/button";
import { getItemConditionBadgeClass } from "@/enums/itemCondition";
import { formatDate, formatMoney, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCategories } from "@/services/hooks/CategoryServicesHook";
import { usePublicItems } from "@/services/hooks/ItemServicesHook";
import type { PublicItem } from "@/services/types/ItemsServicesTypes";

function ItemCard({ item }: { item: PublicItem }) {
  const thumbnail = item.images[0] ?? null;
  const price = item.currentBid ?? item.startingPrice;
  const bidLabel = item.currentBid ? "Current bid" : "Starting bid";

  return (
    <MarketplaceCard
      href={`/items/${item.id}`}
      title={item.title || "Untitled"}
      imageUrl={thumbnail?.url}
      badge={item.category.name}
      chip={
        <span
          className={cn(
            "w-fit rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
            getItemConditionBadgeClass(item.itemCondition),
          )}
        >
          {formatSnakeCase(item.itemCondition)}
        </span>
      }
      footer={
        <>
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-bold tracking-tight text-primary">
              {formatMoney(price)}
            </p>
            <p className="truncate text-[10px] font-medium text-muted-foreground">
              {bidLabel}
            </p>
          </div>
          <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-3 shrink-0 text-primary" aria-hidden />
            Ends {formatDate(item.auction.endTime)}
          </p>
        </>
      }
    />
  );
}

export function PublicActiveItems() {
  const { data: items = [], isPending, isError, error } = usePublicItems();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data ?? [];
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const q = search.trim().toLowerCase();
  const filtered = items.filter((item) => {
    if (categoryId && item.category.id !== categoryId) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  if (isPending) return <PublicActiveItemsSkeleton />;
  if (isError)
    return <p className="text-sm text-destructive">{error.message}</p>;

  return (
    <div className="space-y-4">
      <MarketplaceFilterBar
        search={search}
        onSearchChange={setSearch}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        categories={categories}
        searchInputId="public-item-search"
      />

      {items.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center shadow-md shadow-primary/5">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Gavel className="size-6" />
          </span>
          <p className="mt-4 text-sm font-medium text-foreground">
            No active items
          </p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Live listings will show up here when auctions go active.
          </p>
        </section>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {filtered.length}
            </span>{" "}
            active {filtered.length === 1 ? "item" : "items"}
            {categoryId
              ? ` in ${categories.find((c) => c.id === categoryId)?.name ?? "category"}`
              : ""}
          </p>

          {filtered.length === 0 ? (
            <section className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center shadow-md shadow-primary/5">
              <p className="text-sm font-medium text-foreground">
                No items match your filters
              </p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                Try another category or clear your search.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setCategoryId("");
                }}
              >
                Clear filters
              </Button>
            </section>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
