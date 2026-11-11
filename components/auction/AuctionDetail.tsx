"use client";

import { ArrowLeft, Pencil, Plus, RefreshCw, Send } from "lucide-react";
import { AuctionDetailSkeleton } from "@/components/auction/AuctionDetailSkeleton";
import { ItemTable } from "@/components/item";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AuctionStatus } from "@/enums/auctionStatus";
import {
  canSellerEditAuction,
  canSellerManageAuctionItems,
  getAuctionStatusClass,
} from "@/lib/constants/auctionStatus";
import { formatDate, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  useAuction,
  useSubmitAuction,
} from "@/services/hooks/AuctionServicesHook";
import { useItems } from "@/services/hooks/ItemServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";
import type { Item } from "@/services/types/ItemsServicesTypes";

type AuctionDetailProps = {
  auctionId: string;
  onBack: () => void;
  onAddItem: () => void;
  onOpenItem: (itemId: string) => void;
  onEditItem: (item: Item) => void;
  onEditAuction: (auction: Auction) => void;
};

export function AuctionDetail({
  auctionId,
  onBack,
  onAddItem,
  onOpenItem,
  onEditItem,
  onEditAuction,
}: AuctionDetailProps) {
  const {
    data: auction,
    isPending: isAuctionPending,
    isError,
    error,
  } = useAuction(auctionId);
  const {
    data: items = [],
    isPending: isItemsPending,
    isError: isItemsError,
    error: itemsError,
  } = useItems(auctionId);
  const { mutate: submitAuction, isPending: isSubmitting } = useSubmitAuction();
  const status = (auction?.status?.toUpperCase() ?? "") as AuctionStatus | "";
  const isRejected = status === AuctionStatus.REJECTED;
  const isNoSale = status === AuctionStatus.NO_SALE;
  const isResubmit = isRejected || isNoSale;
  const canManageItems = canSellerManageAuctionItems(status);
  const canSubmit = canManageItems;

  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-primary/8 blur-3xl"
      />

      <div className="app-container relative flex flex-col gap-8 py-8 sm:py-10">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="w-fit text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft data-icon="inline-start" />
          My auctions
        </Button>

        {isAuctionPending ? (
          <AuctionDetailSkeleton />
        ) : isError || !auction ? (
          <p className="text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Could not load this auction."}
          </p>
        ) : (
          <>
            <section className="rounded-2xl bg-card p-5 shadow-md shadow-primary/5 ring-1 ring-border sm:p-6">
              <p className="text-xs font-medium tracking-wide text-primary uppercase">
                Auction
              </p>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {auction.title || "Untitled"}
                  </h1>
                  {status ? (
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        getAuctionStatusClass(status),
                      )}
                    >
                      {formatSnakeCase(status)}
                    </span>
                  ) : null}
                </div>

                {canSubmit || canSellerEditAuction(status) ? (
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {canSellerEditAuction(status) ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5"
                        onClick={() => onEditAuction(auction)}
                      >
                        <Pencil className="size-3.5" />
                        Edit auction
                      </Button>
                    ) : null}
                    {canSubmit ? (
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 gap-1.5 px-3 shadow-sm shadow-primary/20"
                        disabled={
                          isSubmitting || isItemsPending || items.length === 0
                        }
                        onClick={() => submitAuction(auctionId)}
                      >
                        {isResubmit ? (
                          <RefreshCw className="size-3.5" />
                        ) : (
                          <Send className="size-3.5" />
                        )}
                        {isSubmitting
                          ? isResubmit
                            ? "Resubmitting…"
                            : "Submitting…"
                          : isResubmit
                            ? "Resubmit"
                            : "Submit"}
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {auction.description || "No description"}
              </p>

              {auction.rejectionReason ? (
                <div className="mt-3 max-w-2xl rounded-xl border border-destructive/20 bg-destructive/5 px-3.5 py-3">
                  <p className="text-xs font-semibold tracking-wide text-destructive uppercase">
                    Rejection reason
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-destructive">
                    {auction.rejectionReason}
                  </p>
                </div>
              ) : null}

              {canSubmit && !isItemsPending && items.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Add at least one item before{" "}
                  {isResubmit ? "resubmitting" : "submitting"}.
                </p>
              ) : null}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">
                    Starts
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatDate(auction.startTime)}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">
                    Ends
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatDate(auction.endTime)}
                  </p>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    Items
                    {!isItemsPending ? (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({items.length})
                      </span>
                    ) : null}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Lots listed under this auction.
                  </p>
                </div>
                {canManageItems ? (
                  <Button
                    type="button"
                    className="h-10 gap-1.5"
                    onClick={onAddItem}
                  >
                    <Plus data-icon="inline-start" />
                    Add item
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex">
                        <Button type="button" className="h-10 gap-1.5" disabled>
                          <Plus data-icon="inline-start" />
                          Add item
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Items can only be added for draft, rejected, or no-sale
                      auctions
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <ItemTable
                auctionId={auctionId}
                items={items}
                isPending={isItemsPending}
                isError={isItemsError}
                error={itemsError}
                actionsDisabled={!canManageItems}
                onOpenItem={(item) => onOpenItem(item.id)}
                onEditItem={onEditItem}
              />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
