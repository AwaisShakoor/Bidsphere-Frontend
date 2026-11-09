"use client";

import { useState } from "react";
import { Clock, Gavel } from "lucide-react";
import { FilterEmptyState } from "@/components/marketplace/FilterEmptyState";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { MarketplaceFilterBar } from "@/components/marketplace/MarketplaceFilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { PublicActiveItemsSkeleton } from "./PublicActiveItemsSkeleton";
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
      badge={formatSnakeCase(item.auction.status)}
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
        <EmptyState
          icon={<Gavel className="size-5" aria-hidden />}
          title="No live items"
          description="Live listings will show up here when auctions go live."
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {filtered.length}
            </span>{" "}
            live {filtered.length === 1 ? "item" : "items"}
            {categoryId
              ? ` in ${categories.find((c) => c.id === categoryId)?.name ?? "category"}`
              : ""}
          </p>

          {filtered.length === 0 ? (
            <FilterEmptyState
              onClear={() => {
                setSearch("");
                setCategoryId("");
              }}
            />
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
