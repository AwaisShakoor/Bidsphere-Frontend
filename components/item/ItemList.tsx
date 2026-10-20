"use client";

import { useState } from "react";
import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import { ItemListSkeleton } from "@/components/item/ItemListSkeleton";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { formatMoney } from "@/lib/format";
import { useDeleteItem } from "@/services/hooks/ItemServicesHook";
import type { Item } from "@/services/types/ItemsServicesTypes";

type ItemListProps = {
  auctionId: string;
  items: Item[];
  isPending?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onOpenItem: (item: Item) => void;
  onEditItem: (item: Item) => void;
};

const ITEM_LIST_GRID =
  "sm:grid-cols-[minmax(0,1.8fr)_7rem_minmax(6rem,1fr)_minmax(7rem,1fr)_5.5rem]";

export function ItemList({
  auctionId,
  items,
  isPending = false,
  isError = false,
  errorMessage,
  onOpenItem,
  onEditItem,
}: ItemListProps) {
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  function handleConfirmDelete() {
    if (!itemToDelete) return;
    deleteItem(
      { auctionId, itemId: itemToDelete.id },
      { onSuccess: () => setItemToDelete(null) },
    );
  }

  if (isPending) {
    return <ItemListSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {errorMessage || "Could not load items."}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-10 text-center">
        <p className="text-sm font-medium text-foreground">No items yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Add an item to this auction to start listing it.
        </p>
      </section>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        <div
          className={`hidden gap-3 border-b border-border px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:grid sm:items-center ${ITEM_LIST_GRID}`}
        >
          <span>Item</span>
          <span>Condition</span>
          <span>Starting</span>
          <span>Shipping</span>
          <span className="text-center">Actions</span>
        </div>

        <ul className="divide-y divide-border">
          {items.map((item) => {
            const thumbnail =
              [...item.images].sort((a, b) => a.sortOrder - b.sortOrder)[0] ??
              null;

            return (
            <li
              key={item.id}
              className={`grid cursor-pointer gap-3 px-4 py-4 transition-colors hover:bg-muted/40 sm:items-center ${ITEM_LIST_GRID}`}
              onClick={() => onOpenItem(item)}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border">
                  {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnail.url}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="size-4" />
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.title || "Untitled"}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                    {item.description || "No description"}
                  </p>
                </div>
              </div>

              <div>
                <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {item.itemCondition.replaceAll("_", " ")}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                <span className="mb-0.5 block text-xs uppercase tracking-wide sm:hidden">
                  Starting
                </span>
                {formatMoney(item.startingPrice)}
              </p>

              <p className="text-sm text-muted-foreground">
                <span className="mb-0.5 block text-xs uppercase tracking-wide sm:hidden">
                  Shipping
                </span>
                {item.shippingType.replaceAll("_", " ")}
                {item.shippingCost
                  ? ` · ${formatMoney(item.shippingCost)}`
                  : ""}
              </p>

              <div className="flex items-center justify-end gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-primary hover:bg-primary/10 hover:text-primary"
                  title="Edit item"
                  disabled={isDeleting}
                  onClick={(event) => {
                    event.stopPropagation();
                    onEditItem(item);
                  }}
                >
                  <Pencil className="size-4" />
                  <span className="sr-only">Edit item</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  title="Delete item"
                  disabled={isDeleting}
                  onClick={(event) => {
                    event.stopPropagation();
                    setItemToDelete(item);
                  }}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Delete item</span>
                </Button>
              </div>
            </li>
            );
          })}
        </ul>
      </div>

      <DeleteConfirmationDialog
        open={Boolean(itemToDelete)}
        name={itemToDelete?.title ?? ""}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!isDeleting) setItemToDelete(null);
        }}
      />
    </>
  );
}
