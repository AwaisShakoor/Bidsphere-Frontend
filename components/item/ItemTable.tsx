"use client";

import { useState } from "react";
import {
  getItemTableColumns,
  ITEM_TABLE_GRID,
} from "./itemTableColumns";
import { DataTable } from "@/components/ui/DataTable";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { useDeleteItem } from "@/services/hooks/ItemServicesHook";
import type { Item } from "@/services/types/ItemsServicesTypes";

type ItemTableProps = {
  auctionId: string;
  items: Item[];
  isPending?: boolean;
  isError?: boolean;
  error?: Error | null;
  actionsDisabled?: boolean;
  onOpenItem: (item: Item) => void;
  onEditItem: (item: Item) => void;
};

export function ItemTable({
  auctionId,
  items,
  isPending = false,
  isError = false,
  error = null,
  actionsDisabled = false,
  onOpenItem,
  onEditItem,
}: ItemTableProps) {
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  function handleConfirmDelete() {
    if (!itemToDelete || actionsDisabled) return;
    deleteItem(
      { auctionId, itemId: itemToDelete.id },
      { onSuccess: () => setItemToDelete(null) },
    );
  }

  const columns = getItemTableColumns({
    isDeleting,
    actionsDisabled,
    onEditItem,
    onDeleteItem: setItemToDelete,
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        getRowKey={(item) => item.id}
        gridClassName={ITEM_TABLE_GRID}
        isPending={isPending}
        isError={isError}
        error={error}
        emptyTitle="No items yet"
        emptyDescription="Add items to this auction so buyers have lots to bid on."
        filterPlaceholder="Search items..."
        onRowClick={onOpenItem}
      />

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
