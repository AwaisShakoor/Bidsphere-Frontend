"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicItem } from "@/services/types/ItemsServicesTypes";

type PublicItemGalleryProps = {
  item: PublicItem;
  onPreview: (url: string) => void;
};

export function PublicItemGallery({ item, onPreview }: PublicItemGalleryProps) {
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const activeImage =
    item.images.find((image) => image.id === activeImageId) ??
    item.images[0] ??
    null;
  const activeImageIndex = Math.max(
    0,
    item.images.findIndex((image) => image.id === activeImage?.id),
  );

  function showImageAt(index: number) {
    if (!item.images.length) return;
    const next = (index + item.images.length) % item.images.length;
    setActiveImageId(item.images[next]?.id ?? null);
  }

  return (
    <div className="flex flex-col bg-muted/40">
      <div className="relative min-h-72 bg-muted lg:min-h-112">
        {activeImage ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => onPreview(activeImage.url)}
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
  );
}
