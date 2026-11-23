"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AdminAuctionDetail } from "./AdminAuctionDetail";
import { AdminAuctionsTable } from "./AdminAuctionsTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  ADMIN_AUCTION_TABS,
  getAdminAuctionTabEmptyMessage,
  getAdminAuctionsHref,
  getAuctionsByTab,
  parseAdminAuctionTab,
} from "@/lib/adminAuctions";
import { cn } from "@/lib/utils";
import { useAdminAuctions } from "@/services/hooks/AdminServicesHook";

export function AdminAuctions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auctionId = searchParams.get("id");
  const tab = parseAdminAuctionTab(searchParams.get("tab"));

  const { data: auctions = [], isPending, isError, error } = useAdminAuctions();
  const list = getAuctionsByTab(auctions, tab);

  if (auctionId) {
    return (
      <AdminAuctionDetail
        auctionId={auctionId}
        onBack={() => router.push(getAdminAuctionsHref(tab))}
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Auctions"
        description="Review pending submissions and browse active, rejected, and completed auctions."
      />

      <div className="mb-3">
        <div
          role="tablist"
          aria-label="Filter auctions"
          className="inline-flex max-w-full flex-wrap rounded-xl border border-border/80 bg-muted/40 p-1"
        >
          {ADMIN_AUCTION_TABS.map((item) => {
            const selected = tab === item.value;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => router.push(getAdminAuctionsHref(item.value))}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
                  selected
                    ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums leading-none",
                    selected
                      ? "bg-primary/15 text-primary"
                      : "bg-muted-foreground/12 text-muted-foreground",
                  )}
                >
                  {getAuctionsByTab(auctions, item.value).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AdminAuctionsTable
        key={tab}
        auctions={list}
        isPending={isPending}
        isError={isError}
        error={error}
        emptyTitle={getAdminAuctionTabEmptyMessage(tab)}
        onOpenAuction={(auction) =>
          router.push(getAdminAuctionsHref(tab, auction.id))
        }
      />
    </>
  );
}
