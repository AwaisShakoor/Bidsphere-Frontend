import type { DataTableColumn } from "@/components/ui/DataTable";
import { ActionsCell } from "@/components/ui/ActionsCell";
import {
  canSellerEditAuction,
  getAuctionStatusClass,
} from "@/lib/constants/auctionStatus";
import { formatDate, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Auction } from "@/services/types/AuctionServicesTypes";

export const AUCTION_TABLE_GRID =
  "grid-cols-[minmax(0,1.6fr)_7rem_minmax(8rem,1.2fr)_minmax(7rem,1fr)_minmax(7rem,1fr)_5.5rem]";

type AuctionTableColumnOptions = {
  isDeleting: boolean;
  onEditAuction: (auction: Auction) => void;
  onDeleteAuction: (auction: Auction) => void;
};

export function getAuctionTableColumns({
  isDeleting,
  onEditAuction,
  onDeleteAuction,
}: AuctionTableColumnOptions): DataTableColumn<Auction>[] {
  return [
    {
      accessorKey: "title",
      header: "Auction",
      cell: (auction) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {auction.title || "Untitled"}
          </p>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
            {auction.description || "No description"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (auction) => (
        <span
          className={cn(
            "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
            getAuctionStatusClass(auction.status),
          )}
        >
          {formatSnakeCase(auction.status)}
        </span>
      ),
    },
    {
      accessorKey: "rejectionReason",
      header: "Rejection reason",
      cell: (auction) =>
        auction.rejectionReason ? (
          <p className="line-clamp-2 text-sm text-destructive">
            {auction.rejectionReason}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        ),
    },
    {
      accessorKey: "startTime",
      header: "Starts",
      cell: (auction) => (
        <p className="text-sm text-muted-foreground">
          {formatDate(auction.startTime)}
        </p>
      ),
    },
    {
      accessorKey: "endTime",
      header: "Ends",
      cell: (auction) => (
        <p className="text-sm text-muted-foreground">
          {formatDate(auction.endTime)}
        </p>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      sortable: false,
      filterable: false,
      cell: (auction) => {
        const canEdit = canSellerEditAuction(auction.status);
        const disabled = isDeleting || !canEdit;

        return (
          <ActionsCell
            disabled={disabled}
            editTooltip={
              disabled && !isDeleting
                ? "Only draft or rejected auctions can be edited"
                : "Edit auction"
            }
            deleteTooltip={
              disabled && !isDeleting
                ? "Only draft or rejected auctions can be deleted"
                : "Delete auction"
            }
            onEdit={() => onEditAuction(auction)}
            onDelete={() => onDeleteAuction(auction)}
          />
        );
      },
    },
  ];
}
