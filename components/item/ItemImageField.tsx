"use client";

import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { ImageLightbox } from "@/components/item/ImageLightbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_ITEM_IMAGES } from "@/lib/validationSchema/itemSchema";
import { cn } from "@/lib/utils";
import type { ItemImage } from "@/services/types/ItemsServicesTypes";

export type ItemImageFieldValue = {
  images: File[];
  removeImageIds: string[];
  count: number;
};

export function ItemImageField({
  existingImages = [],
  itemTitle,
  disabled = false,
  error,
  onChange,
}: {
  existingImages?: ItemImage[];
  itemTitle?: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: ItemImageFieldValue) => void;
}) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [removeImageIds, setRemoveImageIds] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const keptImages = existingImages.filter(
    (image) => !removeImageIds.includes(image.id),
  );
  const count = keptImages.length + images.length;
  const canAddMore = count < MAX_ITEM_IMAGES;
  const hasImages = count > 0;

  useEffect(() => {
    onChange({ images, removeImageIds, count });
  }, [images, removeImageIds, count, onChange]);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  function handleImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (selected.length === 0) return;

    const remainingSlots = MAX_ITEM_IMAGES - count;
    setImages((current) => [
      ...current,
      ...selected.slice(0, Math.max(remainingSlots, 0)),
    ]);
  }

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="images">Images</Label>
        <span className="text-xs text-muted-foreground">
          {count}/{MAX_ITEM_IMAGES}
        </span>
      </div>

      <Input
        id="images"
        type="file"
        accept="image/*"
        multiple
        disabled={disabled || !canAddMore}
        onChange={handleImagesChange}
        aria-invalid={!!error}
        className="sr-only"
      />

      {!hasImages ? (
        <div
          className={cn(
            "flex h-11 w-full items-center overflow-hidden rounded-lg border border-input bg-transparent dark:bg-input/30",
            error && "border-destructive",
            disabled && "opacity-50",
          )}
        >
          <span className="flex-1 truncate px-3.5 text-sm text-muted-foreground">
            No image chosen
          </span>
          <Label
            htmlFor="images"
            className={cn(
              "flex h-full cursor-pointer items-center border-l border-input bg-muted/40 px-3.5 text-sm font-medium text-foreground transition hover:bg-muted",
              disabled && "pointer-events-none",
            )}
          >
            Choose image
          </Label>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {keptImages.map((image) => (
            <div
              key={image.id}
              className="relative size-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-border sm:size-[4.5rem]"
            >
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPreviewUrl(image.url)}
                className="size-full rounded-none p-0 hover:bg-transparent"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={itemTitle ?? "Item image"}
                  className="size-full object-cover"
                />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon-xs"
                onClick={() =>
                  setRemoveImageIds((current) => [...current, image.id])
                }
                className="absolute top-0.5 right-0.5 size-5 opacity-90 shadow-sm"
                aria-label="Remove image"
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}

          {previews.map((url, index) => (
            <div
              key={url}
              className="relative size-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-border sm:size-[4.5rem]"
            >
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPreviewUrl(url)}
                className="size-full rounded-none p-0 hover:bg-transparent"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={images[index]?.name ?? `Image ${index + 1}`}
                  className="size-full object-cover"
                />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon-xs"
                onClick={() =>
                  setImages((current) =>
                    current.filter((_, i) => i !== index),
                  )
                }
                className="absolute top-0.5 right-0.5 size-5 opacity-90 shadow-sm"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}

          {canAddMore ? (
            <Label
              htmlFor="images"
              className={cn(
                "flex size-16 shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground transition hover:border-primary/40 hover:bg-muted/50 hover:text-foreground sm:size-[4.5rem]",
                disabled && "pointer-events-none opacity-50",
              )}
            >
              <ImagePlus className="size-4" />
              <span className="text-[10px] font-medium">Add</span>
            </Label>
          ) : null}
        </div>
      )}

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      <ImageLightbox
        src={previewUrl}
        alt={itemTitle}
        onClose={() => setPreviewUrl(null)}
      />
    </div>
  );
}
