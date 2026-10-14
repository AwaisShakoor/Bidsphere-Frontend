"use client";

import { ChevronDown } from "lucide-react";
import {
  AUCTION_STATUS_OPTIONS,
  type AuctionStatusValue,
} from "@/enums/auctionStatus";
import { cn } from "@/lib/utils";

type AuctionStatusSelectProps = {
  value: AuctionStatusValue;
  onChange: (value: AuctionStatusValue) => void;
  className?: string;
};

export function AuctionStatusSelect({
  value,
  onChange,
  className,
}: AuctionStatusSelectProps) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <select
        value={value}
        aria-label="Filter by status"
        className={cn(
          "h-10 cursor-pointer appearance-none rounded-lg border border-input bg-card py-0 pr-7 pl-3 text-sm outline-none transition-colors",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        )}
        onChange={(event) =>
          onChange(event.target.value as AuctionStatusValue)
        }
      >
        {AUCTION_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  );
}
