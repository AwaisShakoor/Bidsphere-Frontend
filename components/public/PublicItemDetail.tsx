"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gavel,
  ImageIcon,
  Truck,
} from "lucide-react";
import { ImageLightbox } from "@/components/item/ImageLightbox";
import { PublicItemDetailSkeleton } from "@/components/public/PublicItemDetailSkeleton";
import { Button } from "@/components/ui/button";
import { getItemConditionBadgeClass } from "@/enums/itemCondition";
import { formatDate, formatMoney, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useMe } from "@/services/hooks/AuthServicesHook";
import { usePublicItem } from "@/services/hooks/ItemServicesHook";

export function PublicItemDetail({ itemId }: { itemId: string }) {
  const router = useRouter();
  const { data: meData, isPending: isMePending } = useMe();
  const { data: item, isPending, isError, error } = usePublicItem(itemId);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const user = meData?.user;
  const price = item?.currentBid ?? item?.startingPrice ?? null;
  const bidLabel = item?.currentBid ? "Current bid" : "Starting bid";
  const activeImage =
    item?.images.find((image) => image.id === activeImageId) ??
    item?.images[0] ??
    null;
  const activeImageIndex = item
    ? Math.max(
        0,
        item.images.findIndex((image) => image.id === activeImage?.id),
      )
    : 0;

  function handlePlaceBid() {
    router.push(`/login?next=${encodeURIComponent(`/items/${itemId}`)}`);
  }

  function showImageAt(index: number) {
    if (!item?.images.length) return;
    const next = (index + item.images.length) % item.images.length;
    setActiveImageId(item.images[next]?.id ?? null);
  }

  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-linear-to-b from-primary/12 via-accent/40 to-transparent"
      />

      <div className="app-container relative flex flex-col gap-6 py-8 sm:gap-8 sm:py-10">
        <Button
          type="button"
          variant="ghost"
          asChild
          className="w-fit text-muted-foreground hover:text-foreground"
        >
          <Link href="/">
            <ArrowLeft data-icon="inline-start" />
            Back to items
          </Link>
        </Button>

        {isPending ? (
          <PublicItemDetailSkeleton />
        ) : isError ? (
          <p className="text-sm text-destructive">{error.message}</p>
        ) : !item ? null : (
          <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/10 ring-1 ring-primary/20">
            <div className="grid lg:grid-cols-2">
              <div className="flex flex-col bg-muted/40">
                <div className="relative min-h-72 bg-muted lg:min-h-112">
                  {activeImage ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setPreviewUrl(activeImage.url)}
                      className="relative h-full min-h-72 w-full rounded-none p-0 hover:bg-transparent active:translate-y-0 lg:min-h-112"
                    >
                      <Image
                        src={activeImage.url}
                        alt={item.title || "Item"}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                        priority
                      />
                    </Button>
                  ) : (
                    <span className="flex size-full min-h-72 items-center justify-center bg-primary/5 text-primary/40 lg:min-h-112">
                      <ImageIcon className="size-10" />
                    </span>
                  )}
                  <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                    {item.category.name}
                  </span>

                  {item.images.length > 1 ? (
                    <>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          showImageAt(activeImageIndex - 1);
                        }}
                        className="absolute top-1/2 left-3 z-10 size-9 -translate-y-1/2 rounded-full bg-card/90 shadow-md ring-1 ring-border/70 backdrop-blur-sm hover:bg-card"
                        aria-label="Previous photo"
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-sm"
                        onClick={() => showImageAt(activeImageIndex + 1)}
                        className="absolute top-1/2 right-3 z-10 size-9 -translate-y-1/2 rounded-full bg-card/90 shadow-md ring-1 ring-border/70 backdrop-blur-sm hover:bg-card active:-translate-y-1/2"
                        aria-label="Next photo"
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </>
                  ) : null}
                </div>

                {item.images.length > 1 ? (
                  <div className="border-t border-border/70 bg-card px-3 pt-2.5 pb-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Select a photo to view
                      </p>
                      <p className="text-xs font-semibold text-primary tabular-nums">
                        {activeImageIndex + 1} / {item.images.length}
                      </p>
                    </div>
                    <div className="flex gap-2 overflow-x-auto scrollbar-none">
                      {item.images.map((image, index) => {
                        const selected = activeImage?.id === image.id;
                        return (
                          <button
                            key={image.id}
                            type="button"
                            onClick={() => setActiveImageId(image.id)}
                            className={`relative size-16 shrink-0 overflow-hidden rounded-lg ring-2 transition-all ${
                              selected
                                ? "ring-primary"
                                : "ring-transparent hover:ring-primary/35"
                            }`}
                            aria-label={`Show photo ${index + 1}`}
                            aria-pressed={selected}
                          >
                            <Image
                              src={image.url}
                              alt={`${item.title} photo ${index + 1}`}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-5 bg-linear-to-br from-accent/70 via-card to-card p-5 sm:p-6 lg:p-8">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold tracking-wide text-primary-foreground uppercase shadow-sm shadow-primary/20">
                      Active
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                        getItemConditionBadgeClass(item.itemCondition),
                      )}
                    >
                      {formatSnakeCase(item.itemCondition)}
                    </span>
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {item.title || "Untitled"}
                  </h1>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description || "No description"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/10 px-3.5 py-2.5">
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold tracking-tight text-primary">
                      {formatMoney(price)}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {bidLabel}
                    </p>
                  </div>
                  <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock
                      className="size-3.5 shrink-0 text-primary"
                      aria-hidden
                    />
                    Ends {formatDate(item.auction.endTime)}
                  </p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-3">
                  <div className="rounded-xl border border-primary/15 bg-card/80 px-3.5 py-3">
                    <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                      Starting
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatMoney(item.startingPrice)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/15 bg-card/80 px-3.5 py-3">
                    <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                      Reserve
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatMoney(item.reservePrice)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/15 bg-card/80 px-3.5 py-3">
                    <p className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-primary uppercase">
                      <Truck className="size-3" aria-hidden />
                      Shipping
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatSnakeCase(item.shippingType)}
                      {item.shippingCost
                        ? ` · ${formatMoney(item.shippingCost)}`
                        : ""}
                    </p>
                  </div>
                </div>

                {!isMePending && !user ? (
                  <div className="mt-auto flex flex-col gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      Sign in to place a bid on this item.
                    </p>
                    <Button
                      type="button"
                      size="lg"
                      className="h-10 gap-2 px-4 shadow-sm shadow-primary/15"
                      onClick={handlePlaceBid}
                    >
                      <Gavel className="size-4" />
                      Log in to bid
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
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
