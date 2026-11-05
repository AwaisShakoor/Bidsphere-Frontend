export enum BidStatus {
  ACTIVE = "ACTIVE",
  OUTBID = "OUTBID",
}

export const BID_STATUS_CLASS: Record<BidStatus, string> = {
  [BidStatus.ACTIVE]: "bg-primary/10 text-primary",
  [BidStatus.OUTBID]: "bg-muted text-muted-foreground",
};

export function getBidStatusClass(status: string) {
  const key = status.toUpperCase() as BidStatus;
  return BID_STATUS_CLASS[key] ?? "bg-muted text-muted-foreground";
}
