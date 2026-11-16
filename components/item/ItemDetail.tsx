"use client";

import { useState } from "react";
import { ArrowLeft, Package, Trophy } from "lucide-react";
import { ImageLightbox } from "@/components/item/ImageLightbox";
import { ItemDetailSkeleton } from "@/components/item/ItemDetailSkeleton";
import { getItemDetailStats } from "@/components/item/itemDetailStats";
import { Button } from "@/components/ui/button";
import { TruncatedText } from "@/components/ui/TruncatedText";
import { formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAuction } from "@/services/hooks/AuctionServicesHook";
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
  const { data: auction } = useAuction(auctionId);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cover = item?.images[0]?.url;

  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-primary/8 blur-3xl"
      />

      <div className="app-container relative flex flex-col gap-8 py-8 sm:py-10">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ml-2 w-fit text-muted-foreground hover:text-foreground"
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
          <div className="flex flex-col gap-8">
            <header className="rounded-2xl bg-linear-to-br from-accent/70 via-card to-card p-5 shadow-md shadow-primary/10 ring-1 ring-primary/20 sm:p-6">
              <div className="flex gap-4 sm:gap-5">
                {cover ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setPreviewUrl(cover)}
                    className="size-20 shrink-0 overflow-hidden rounded-xl p-0 ring-1 ring-primary/15 hover:bg-transparent hover:ring-primary/40 sm:size-24"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt={item.title}
                      className="size-full object-cover"
                    />
                  </Button>
                ) : (
                  <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground ring-1 ring-border sm:size-24">
                    <Package className="size-7 opacity-50" aria-hidden />
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold tracking-wide text-primary-foreground uppercase shadow-sm shadow-primary/20">
                      Item
                    </span>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {formatSnakeCase(item.itemCondition)}
                    </span>
                    {item.winner ? (
                      <span className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        <Trophy className="size-3 shrink-0" aria-hidden />
                        <span className="truncate">
                          Winner: {item.winner.firstName} {item.winner.lastName}
                        </span>
                      </span>
                    ) : null}
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {item.title || "Untitled"}
                  </h2>
                  <TruncatedText
                    text={item.description || "No description"}
                    limit={160}
                    lines={2}
                    className="text-sm leading-relaxed text-muted-foreground"
                  />
                  {auction?.rejectionReason ? (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-3.5 py-3">
                      <p className="text-[11px] font-semibold tracking-wide text-destructive uppercase">
                        Auction rejection reason
                      </p>
                      <TruncatedText
                        text={auction.rejectionReason}
                        limit={120}
                        lines={2}
                        className="mt-1.5 text-sm leading-relaxed text-destructive"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </header>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold tracking-wide text-primary uppercase">
                Pricing & shipping
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {getItemDetailStats(item).map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "rounded-xl border p-3.5",
                      stat.accent
                        ? "border-primary/20 bg-primary/5"
                        : "border-border/80 bg-muted/40",
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "inline-flex size-8 shrink-0 items-center justify-center rounded-lg",
                          stat.accent
                            ? "bg-primary/15 text-primary"
                            : "bg-background text-muted-foreground ring-1 ring-border",
                        )}
                      >
                        <stat.icon className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                          {stat.label}
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-foreground">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {item.images.length > 0 ? (
              <section className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wide text-primary uppercase">
                  Photos ({item.images.length})
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {item.images.map((image) => (
                    <Button
                      key={image.id}
                      type="button"
                      variant="ghost"
                      onClick={() => setPreviewUrl(image.url)}
                      className="h-auto overflow-hidden rounded-2xl p-0 ring-1 ring-primary/15 hover:bg-transparent hover:ring-primary/45"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={item.title}
                        className="aspect-square w-full object-cover"
                      />
                    </Button>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
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
