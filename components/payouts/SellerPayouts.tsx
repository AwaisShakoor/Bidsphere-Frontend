"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, History, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SellerPayoutsHero } from "./SellerPayoutsHero";
import { SellerPayoutsHistory } from "./SellerPayoutsHistory";

type PayoutsTab = "setup" | "history";

const TABS: {
  value: PayoutsTab;
  label: string;
  Icon: typeof Link2;
}[] = [
  { value: "setup", label: "Connect Stripe", Icon: Link2 },
  { value: "history", label: "Payout history", Icon: History },
];

export function SellerPayouts() {
  const [tab, setTab] = useState<PayoutsTab>("setup");

  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-primary/8 blur-3xl"
      />

      <div className="app-container relative flex flex-col gap-3 py-6 sm:py-8">
        <Button
          type="button"
          variant="ghost"
          asChild
          className="h-8 w-fit px-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/dashboard">
            <ArrowLeft data-icon="inline-start" />
            Back to dashboard
          </Link>
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <header className="min-w-0 space-y-0.5">
            <p className="text-xs font-medium tracking-wide text-primary uppercase">
              Seller
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              My payouts
            </h1>
          </header>

          <div
            role="tablist"
            aria-label="Payouts sections"
            className="inline-flex w-fit max-w-full flex-wrap gap-1 rounded-xl border border-primary/15 bg-primary/5 p-1"
          >
            {TABS.map(({ value, label, Icon }) => {
              const selected = tab === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(value)}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all sm:text-sm",
                    selected
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : "text-muted-foreground hover:bg-background/80 hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5 opacity-90" aria-hidden />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div role="tabpanel" className="min-w-0">
          {tab === "setup" ? <SellerPayoutsHero /> : <SellerPayoutsHistory />}
        </div>
      </div>
    </main>
  );
}
