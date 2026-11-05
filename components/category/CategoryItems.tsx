"use client";

import { ImageIcon } from "lucide-react";
import { ItemListSkeleton } from "@/components/item/ItemListSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatSnakeCase, formatMoney } from "@/lib/format";
import { getPrimaryImage } from "@/lib/getPrimaryImage";
import { useCategoryItems } from "@/services/hooks/ItemServicesHook";

export function CategoryItems({ slug }: { slug: string }) {
  const {
    data: items = [],
    isPending,
    isError,
    error,
  } = useCategoryItems(slug);

  if (isPending) {
    return <ItemListSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error
          ? error.message
          : "Could not load items for this category."}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ImageIcon className="size-5" aria-hidden />}
        title="No items found"
        description="There are no listings in this category yet."
      />
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const thumbnail = getPrimaryImage(item.images);

        return (
          <li
            key={item.id}
            className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border"
          >
            <div className="h-44 w-full bg-muted">
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnail.url}
                  alt={item.title || "Item"}
                  className="size-full object-cover"
                />
              ) : (
                <span className="flex size-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-8" />
                </span>
              )}
            </div>
            <div className="space-y-2 p-4">
              <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {formatSnakeCase(item.itemCondition)}
              </span>
              <h3 className="truncate text-sm font-semibold text-foreground">
                {item.title || "Untitled"}
              </h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {item.description || "No description"}
              </p>
              <p className="text-sm font-medium text-foreground">
                {formatMoney(item.startingPrice)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
