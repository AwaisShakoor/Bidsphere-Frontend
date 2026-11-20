import { ImageIcon, Trophy } from "lucide-react";
import type { DataTableColumn } from "@/components/ui/DataTable";
import { ActionsCell } from "@/components/ui/ActionsCell";
import { TruncatedText } from "@/components/ui/TruncatedText";
import { formatMoney, formatSnakeCase } from "@/lib/format";
import { getPrimaryImage } from "@/lib/getPrimaryImage";
import type { Item } from "@/services/types/ItemsServicesTypes";

export const ITEM_TABLE_GRID =
  "grid-cols-[2.5rem_minmax(0,1.6fr)_7rem_minmax(6rem,0.9fr)_minmax(7rem,1fr)_minmax(7rem,1fr)_5.5rem]";

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
        const thumbnail = getPrimaryImage(item.images);

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
              <TruncatedText
                text={item.title || "Untitled"}
                limit={40}
                className="text-sm font-semibold text-foreground"
              />
              <TruncatedText
                text={item.description || "No description"}
                limit={56}
                className="mt-0.5 text-sm text-muted-foreground"
              />
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
      accessorKey: "winner",
      header: "Winner",
      cell: (item) =>
        item.winner ? (
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300">
            <Trophy className="size-3 shrink-0" aria-hidden />
            <span className="truncate">
              {item.winner.firstName} {item.winner.lastName}
            </span>
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
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
              ? "Items can only be changed for draft or rejected auctions"
              : "Edit item"
          }
          deleteTooltip={
            actionsDisabled
              ? "Items can only be changed for draft or rejected auctions"
              : "Delete item"
          }
          onEdit={() => onEditItem(item)}
          onDelete={() => onDeleteItem(item)}
        />
      ),
    },
  ];
}
