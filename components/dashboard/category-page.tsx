"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpDown, SlidersHorizontal } from "lucide-react";

import { MyAuctionsCards } from "@/components/auction/my-auctions-cards";
import { Button } from "@/components/ui/button";
import { BidSphereLoader } from "@/components/ui/bidsphere-loader";
import { getCategoryIcon } from "@/lib/constants/categories";
import { useMyAuctions } from "@/services/hooks/AuctionServicesHook";
import { useCategories } from "@/services/hooks/CategoryServicesHook";

type CategoryPageProps = {
  slug: string;
};

export function CategoryPage({ slug }: CategoryPageProps) {
  const { data: categories = [], isLoading, isError } = useCategories();
  const category = categories.find((item) => item.slug === slug);
  const {
    data: auctions = [],
    isLoading: auctionsLoading,
    isError: auctionsError,
  } = useMyAuctions(
    category ? { categoryId: category.id } : undefined,
    { enabled: Boolean(category) },
  );
  const Icon = getCategoryIcon(slug);

  if (isLoading) {
    return (
      <main className="flex flex-1">
        <BidSphereLoader text="Loading category..." />
      </main>
    );
  }

  if (isError || !category) {
    return (
      <main className="app-container flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-sm font-medium text-foreground">Category not found</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
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
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        <section className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-lg shadow-primary/5 ring-1 ring-border sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="size-6" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-medium tracking-wide text-primary uppercase">
                Category
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {category.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Your auctions in this category.
              </p>
            </div>
          </div>

          {/* <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" className="h-9 gap-1.5">
              <SlidersHorizontal className="size-3.5" />
              Filters
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-9 gap-1.5">
              <ArrowUpDown className="size-3.5" />
              Sort
            </Button>
          </div> */}
        </section>

        <MyAuctionsCards
          auctions={auctions}
          isLoading={auctionsLoading}
          isError={auctionsError}
        />
      </div>
    </main>
  );
}
