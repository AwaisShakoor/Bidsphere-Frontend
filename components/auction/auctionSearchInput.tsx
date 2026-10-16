"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AuctionSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function AuctionSearchInput({
  value,
  onChange,
  className,
}: AuctionSearchInputProps) {
  const hasValue = value.length > 0;

  return (
    <div className={cn("relative min-w-0 flex-1 sm:max-w-sm", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 z-10 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title…"
        aria-label="Search auctions by title"
        className={cn("h-10 bg-card pl-9", hasValue ? "pr-10" : "pr-3")}
      />
      {hasValue ? (
        <button
          type="button"
          aria-label="Clear search"
          className="absolute top-1/2 right-2 z-10 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
          onClick={() => onChange("")}
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
