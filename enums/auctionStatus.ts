export enum AuctionStatus {
  ALL = "all",
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  SCHEDULED = "SCHEDULED",
  ACTIVE = "ACTIVE",
  ENDED = "ENDED",
  CANCELLED = "CANCELLED",
}

export type AuctionStatusValue = `${AuctionStatus}`;

export const AUCTION_STATUS_OPTIONS = [
  { value: AuctionStatus.ALL, label: "All statuses" },
  { value: AuctionStatus.DRAFT, label: "Draft" },
  { value: AuctionStatus.PENDING, label: "Pending" },
  { value: AuctionStatus.SCHEDULED, label: "Scheduled" },
  { value: AuctionStatus.ACTIVE, label: "Active" },
  { value: AuctionStatus.ENDED, label: "Ended" },
  { value: AuctionStatus.CANCELLED, label: "Cancelled" },
] as const;

export const DEFAULT_AUCTION_STATUS = AuctionStatus.ALL;
