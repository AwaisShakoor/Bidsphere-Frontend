import { ImageIcon } from "lucide-react";
import type { DataTableColumn } from "@/components/ui/DataTable";
import { ActionsCell } from "@/components/ui/ActionsCell";
import { formatMoney, formatSnakeCase } from "@/lib/format";
import type { Item } from "@/services/types/ItemsServicesTypes";

export const ITEM_TABLE_GRID =
  "grid-cols-[minmax(0,1.8fr)_7rem_minmax(6rem,1fr)_minmax(7rem,1fr)_5.5rem]";

type ItemTableColumnOptions = {
  isDeleting: boolean;
  actionsDisabled?: boolean;
  onEditItem: (item: Item) => void;
  onDeleteItem: (item: Item) => void;
};

export function getItemTableColumns({
  isDeleting,
  actionsDisabled = false,
  onEditItem,
  onDeleteItem,
}: ItemTableColumnOptions): DataTableColumn<Item>[] {
  const disabled = isDeleting || actionsDisabled;

  return [
    {
      accessorKey: "title",
      header: "Item",
      cell: (item) => {
        const thumbnail =
          [...item.images].sort((a, b) => a.sortOrder - b.sortOrder)[0] ?? null;

        return (
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border">
              {thumbnail ? (
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
        );
      },
    },
    {
      accessorKey: "itemCondition",
      header: "Condition",
      cell: (item) => (
        <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {formatSnakeCase(item.itemCondition)}
        </span>
      ),
    },
    {
      accessorKey: "startingPrice",
      header: "Starting",
      cell: (item) => (
        <p className="text-sm text-muted-foreground">
          {formatMoney(item.startingPrice)}
        </p>
      ),
    },
    {
      accessorKey: "shippingType",
      header: "Shipping",
      cell: (item) => (
        <p className="text-sm text-muted-foreground">
          {formatSnakeCase(item.shippingType)}
          {item.shippingCost ? ` · ${formatMoney(item.shippingCost)}` : ""}
        </p>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      sortable: false,
      filterable: false,
      cell: (item) => (
        <ActionsCell
          disabled={disabled}
          editTooltip={
            actionsDisabled
              ? "Items cannot be changed while pending approval"
              : "Edit item"
          }
          deleteTooltip={
            actionsDisabled
              ? "Items cannot be changed while pending approval"
              : "Delete item"
          }
          onEdit={() => onEditItem(item)}
          onDelete={() => onDeleteItem(item)}
        />
      ),
    },
  ];
}
