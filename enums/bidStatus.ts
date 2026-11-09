export enum BidStatus {
  ACTIVE = "ACTIVE",
  OUTBID = "OUTBID",
  WON = "WON",
  LOST = "LOST",
}

export const BID_STATUS_CLASS: Record<BidStatus, string> = {
  [BidStatus.ACTIVE]: "bg-primary/10 text-primary",
  [BidStatus.OUTBID]: "bg-muted text-muted-foreground",
  [BidStatus.WON]: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  [BidStatus.LOST]: "bg-muted text-muted-foreground",
};

export function getBidStatusClass(status: string) {
  const key = status.toUpperCase() as BidStatus;
  return BID_STATUS_CLASS[key] ?? "bg-muted text-muted-foreground";
}
