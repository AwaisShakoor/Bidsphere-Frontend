"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { List } from "lucide-react";
import { MyAuctionsCards } from "@/components/auction/my-auctions-cards";
import { Button } from "@/components/ui/button";
import { BidSphereLoader } from "@/components/ui/bidsphere-loader";
import { UserRole } from "@/enums/userRole";
import {
  ALL_CATEGORIES_ICON,
  getCategoryIcon,
} from "@/lib/constants/categories";
import { cn } from "@/lib/utils";
import { useMyAuctions } from "@/services/hooks/AuctionServicesHook";
import { useMe } from "@/services/hooks/AuthServicesHook";
import { useCategories } from "@/services/hooks/CategoryServicesHook";

export function DashboardHome() {
  const router = useRouter();
  const { data: meData } = useMe();
  const { data: categories = [], isLoading, isError } = useCategories();
  const user = meData?.user;
  const isSeller =
    user?.role === UserRole.SELLER || user?.role === UserRole.ADMIN;
  const {
    data: myAuctions = [],
    isLoading: myAuctionsLoading,
    isError: myAuctionsError,
  } = useMyAuctions(undefined, { enabled: isSeller });

  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-primary/8 blur-3xl"
      />

      <div className="app-container relative flex flex-col gap-8 py-8 sm:py-10">
        <section>
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            Welcome back
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            Hello, {user?.firstName}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Browse categories and find auctions to bid on.
          </p>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Shop by category
            </h2>
            <p className="text-sm text-muted-foreground">
              Open a category to see its auctions.
            </p>
          </div>

          {isLoading ? (
            <BidSphereLoader text="Loading categories..." />
          ) : isError ? (
            <p className="text-sm text-destructive">
              Could not load categories. Try again later.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-2xl bg-card cursor-pointer p-4 text-left shadow-md shadow-primary/5 ring-1 ring-primary/40 transition"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <ALL_CATEGORIES_ICON className="size-5" aria-hidden />
                </span>
                <span className="mt-3 block text-sm font-medium text-foreground">
                  All categories
                </span>
              </button>

              {categories.map((category) => {
                const Icon = getCategoryIcon(category.slug);

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      router.push(`/dashboard/category/${category.slug}`)
                    }
                    className={cn(
                      "rounded-2xl bg-card p-4 cursor-pointer text-left shadow-md shadow-primary/5 ring-1 ring-border transition hover:ring-primary/30",
                    )}
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="mt-3 block text-sm font-medium text-foreground">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {isSeller ? (
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  My auctions
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your listed auctions as cards.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href="/dashboard/my-auctions">
                  <List className="size-3.5" />
                  Manage listings
                </Link>
              </Button>
            </div>
            <MyAuctionsCards
              auctions={myAuctions}
              isLoading={myAuctionsLoading}
              isError={myAuctionsError}
            />
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
            <p className="text-sm font-medium text-foreground">
              Pick a category to browse listings
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Public auction lists will load on each category page once that API
              is connected.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
