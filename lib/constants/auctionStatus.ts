import { AuctionStatus } from "@/enums/auctionStatus";

export const AUCTION_STATUS_CLASS: Record<AuctionStatus, string> = {
  [AuctionStatus.DRAFT]: "bg-muted text-muted-foreground",
  [AuctionStatus.PENDING_APPROVAL]: "bg-amber-100 text-amber-800",
  [AuctionStatus.ACTIVE]: "bg-primary text-primary-foreground",
  [AuctionStatus.ENDED]: "bg-rose-100 text-rose-800",
  [AuctionStatus.COMPLETED]: "bg-slate-100 text-slate-700",
  [AuctionStatus.NO_SALE]: "bg-slate-100 text-slate-700",
  [AuctionStatus.CANCELLED]: "bg-red-100 text-red-800",
  [AuctionStatus.REJECTED]: "bg-red-100 text-red-800",
};

export function getAuctionStatusClass(status: string) {
  const key = status.toUpperCase() as AuctionStatus;
  return AUCTION_STATUS_CLASS[key] ?? "bg-muted text-muted-foreground";
}

/** Seller can edit/delete the auction itself. */
export function canSellerEditAuction(status: string | null | undefined) {
  const key = status?.toUpperCase();
  return key === AuctionStatus.DRAFT || key === AuctionStatus.REJECTED;
}

/** Seller can add/edit items and submit/resubmit for approval. */
export function canSellerManageAuctionItems(
  status: string | null | undefined,
) {
  const key = status?.toUpperCase();
  return key === AuctionStatus.DRAFT || key === AuctionStatus.REJECTED;
}
