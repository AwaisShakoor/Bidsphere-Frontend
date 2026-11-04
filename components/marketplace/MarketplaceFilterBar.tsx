"use client";

import { Search, X } from "lucide-react";
import { CategoryScroller } from "@/components/public/CategoryScroller";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "@/services/types/CategoryServicesTypes";

type MarketplaceFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (id: string) => void;
  categories: Category[];
  searchInputId?: string;
};

export function MarketplaceFilterBar({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  categories,
  searchInputId = "marketplace-search",
}: MarketplaceFilterBarProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border transition-shadow focus-within:ring-primary/30 focus-within:shadow-md focus-within:shadow-primary/10">
      <div className="relative border-b border-border/70 bg-linear-to-br from-primary/8 via-card to-card p-3 sm:p-4">
        <label className="sr-only" htmlFor={searchInputId}>
          Search
        </label>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-primary"
          />
          <Input
            id={searchInputId}
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search auctions, titles, descriptions..."
            className="h-12 border-primary/20 bg-background pr-11 pl-11 text-sm shadow-sm shadow-primary/5 placeholder:text-muted-foreground/80 focus-visible:border-primary/40 focus-visible:ring-primary/20"
          />
          {search ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onSearchChange("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="bg-card px-3 py-3 sm:px-4">
        <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Categories
        </p>
        <CategoryScroller
          categories={categories}
          categoryId={categoryId}
          onCategoryChange={onCategoryChange}
          trailing={
            search || categoryId ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-auto shrink-0 rounded-lg px-3.5 py-1.5 text-sm"
                onClick={() => {
                  onSearchChange("");
                  onCategoryChange("");
                }}
              >
                Clear filters
              </Button>
            ) : null
          }
        />
      </div>
    </div>
  );
}
