"use client";

import { CategoryList } from "@/components/category";
import { useMe } from "@/services/hooks/AuthServicesHook";

export function Dashboard() {
  const { data: meData, isPending } = useMe();
  const user = meData?.user;

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
          {isPending ? (
            <div className="mt-1 space-y-2">
              <div className="h-9 w-48 max-w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
            </div>
          ) : (
            <>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                Hello, {user?.firstName}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Browse categories and find auctions to bid on.
              </p>
            </>
          )}
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
          <CategoryList />
        </section>

        <section className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
          <p className="text-sm font-medium text-foreground">
            Pick a category to browse listings
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Public auction lists will load on each category page once that API
            is connected.
          </p>
        </section>
      </div>
    </main>
  );
}
