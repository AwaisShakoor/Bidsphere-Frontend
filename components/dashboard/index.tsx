"use client";

import { CategoryList } from "@/components/category";
import { SellerActiveAuctions } from "./SellerActiveAuctions";
import { UserRole } from "@/enums/userRole";
import { useMe } from "@/services/hooks/AuthServicesHook";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Dashboard() {
  const { data: meData, isPending } = useMe();
  const user = meData?.user;
  const isSeller = user?.role === UserRole.SELLER;

  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-primary/8 blur-3xl"
      />

      <div className="app-container relative flex flex-col gap-8 py-8 sm:py-10">
        <header className="relative overflow-hidden rounded-2xl bg-primary/6 ring-1 ring-primary/10">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1 bg-primary"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full bg-primary/10 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 right-16 size-36 rounded-full bg-primary/8 blur-2xl"
          />

          <div className="relative flex items-start gap-4 px-5 py-6 pl-6 sm:items-center sm:gap-5 sm:px-7 sm:py-7 sm:pl-8">
            {isPending ? (
              <div className="size-14 shrink-0 animate-pulse rounded-2xl bg-muted" />
            ) : user ? (
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-md shadow-primary/25">
                {user.firstName.charAt(0).toUpperCase()}
              </span>
            ) : null}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  {getGreeting()}
                </p>
                {!isPending && user ? (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-primary uppercase">
                    {user.role.toLowerCase()}
                  </span>
                ) : null}
              </div>

              {isPending ? (
                <div className="mt-2 space-y-2">
                  <div className="h-8 w-48 max-w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
                </div>
              ) : (
                <>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {user?.firstName}
                  </h1>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {isSeller
                      ? "Your live auctions appear below. Use Manage auctions anytime to create or edit listings."
                      : "Browse categories below and find auctions to bid on."}
                  </p>
                </>
              )}
            </div>
          </div>
        </header>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Shop by category
            </h2>
            <p className="text-sm text-muted-foreground">
              Open a category to browse its items.
            </p>
          </div>
          <CategoryList />
        </section>

        {!isPending ? <SellerActiveAuctions isSeller={isSeller} /> : null}
      </div>
    </main>
  );
}
