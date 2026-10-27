import { AuctionStatus } from "@/enums/auctionStatus";

export const AUCTION_STATUS_LABEL: Record<AuctionStatus, string> = {
  [AuctionStatus.DRAFT]: "Draft",
  [AuctionStatus.PENDING_APPROVAL]: "Pending approval",
  [AuctionStatus.ACTIVE]: "Active",
  [AuctionStatus.ENDED]: "Ended",
  [AuctionStatus.COMPLETED]: "Completed",
  [AuctionStatus.NO_SALE]: "No sale",
  [AuctionStatus.CANCELLED]: "Cancelled",
  [AuctionStatus.REJECTED]: "Rejected",
};

export const AUCTION_STATUS_CLASS: Record<AuctionStatus, string> = {
  [AuctionStatus.DRAFT]: "bg-muted text-muted-foreground",
  [AuctionStatus.PENDING_APPROVAL]: "bg-amber-100 text-amber-800",
  [AuctionStatus.ACTIVE]: "bg-emerald-100 text-emerald-800",
  [AuctionStatus.ENDED]: "bg-slate-100 text-slate-700",
  [AuctionStatus.COMPLETED]: "bg-slate-100 text-slate-700",
  [AuctionStatus.NO_SALE]: "bg-slate-100 text-slate-700",
  [AuctionStatus.CANCELLED]: "bg-red-100 text-red-800",
  [AuctionStatus.REJECTED]: "bg-red-100 text-red-800",
};

export function getAuctionStatusLabel(status: AuctionStatus) {
  return AUCTION_STATUS_LABEL[status] ?? status;
}

export function getAuctionStatusClass(status: AuctionStatus) {
  return AUCTION_STATUS_CLASS[status] ?? "bg-muted text-muted-foreground";
}
