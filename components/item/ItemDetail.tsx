"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ImageLightbox } from "@/components/item/ImageLightbox";
import { ItemDetailSkeleton } from "@/components/item/ItemDetailSkeleton";
import { Button } from "@/components/ui/button";
import { formatSnakeCase, formatMoney } from "@/lib/format";
import { useItem } from "@/services/hooks/ItemServicesHook";

export function ItemDetail({
  auctionId,
  itemId,
  onBack,
}: {
  auctionId: string;
  itemId: string;
  onBack: () => void;
}) {
  const { data: item, isPending, isError, error } = useItem(auctionId, itemId);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
          Back to auction
        </Button>

        {isPending ? (
          <ItemDetailSkeleton />
        ) : isError || !item ? (
          <p className="text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Could not load this item."}
          </p>
        ) : (
          <section className="flex flex-col gap-6 rounded-2xl bg-card p-5 shadow-md shadow-primary/5 ring-1 ring-border sm:p-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium tracking-wide text-primary uppercase">
                  Item
                </p>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {formatSnakeCase(item.itemCondition)}
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {item.title || "Untitled"}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {item.description || "No description"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-muted/50 px-4 py-3">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  Starting price
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatMoney(item.startingPrice)}
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 px-4 py-3">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  Reserve price
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatMoney(item.reservePrice)}
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 px-4 py-3">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  Shipping
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatSnakeCase(item.shippingType)}
                  {item.shippingCost
                    ? ` · ${formatMoney(item.shippingCost)}`
                    : ""}
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 px-4 py-3">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  Current bid
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatMoney(item.currentBid)}
                </p>
              </div>
            </div>

            {item.images.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {item.images.map((image) => (
                  <Button
                    key={image.id}
                    type="button"
                    variant="ghost"
                    onClick={() => setPreviewUrl(image.url)}
                    className="h-auto overflow-hidden rounded-xl p-0 ring-1 ring-border hover:bg-transparent hover:ring-primary/40"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={item.title}
                      className="h-48 w-full object-cover"
                    />
                  </Button>
                ))}
              </div>
            ) : null}
          </section>
        )}
      </div>

      <ImageLightbox
        src={previewUrl}
        alt={item?.title}
        onClose={() => setPreviewUrl(null)}
      />
    </main>
  );
}
