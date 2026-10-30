import type { DataTableColumn } from "@/components/ui/DataTable";
import { getAuctionStatusClass } from "@/lib/constants/auctionStatus";
import { formatDate, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminAuction } from "@/services/types/AdminServicesTypes";

export const ADMIN_AUCTIONS_TABLE_GRID =
  "grid-cols-[minmax(0,1.5fr)_minmax(9rem,1fr)_7.5rem_4.5rem_minmax(8rem,1fr)]";

export const adminAuctionsTableColumns: DataTableColumn<AdminAuction>[] = [
  {
    accessorKey: "title",
    header: "Auction",
    cell: (auction) => (
      <p className="truncate text-sm font-semibold text-foreground">
        {auction.title || "Untitled"}
      </p>
    ),
  },
  {
    accessorKey: "seller",
    header: "Seller",
    cell: (auction) => (
      <>
        <p className="truncate text-sm text-foreground">
          {auction.seller.firstName} {auction.seller.lastName}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {auction.seller.email}
        </p>
      </>
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
    accessorKey: "items",
    header: "Items",
    cell: (auction) => (
      <p className="text-sm text-muted-foreground">{auction.items.length}</p>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: (auction) => (
      <p className="text-sm text-muted-foreground">
        {formatDate(auction.createdAt)}
      </p>
    ),
  },
];
