"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AuctionSort,
  AUCTION_SORT_OPTIONS,
  type AuctionSortValue,
} from "@/enums/auctionSort";
import { cn } from "@/lib/utils";

type AuctionSortSelectProps = {
  value: AuctionSortValue;
  onChange: (value: AuctionSortValue) => void;
  className?: string;
};

export function AuctionSortSelect({
  value,
  onChange,
  className,
}: AuctionSortSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedLabel =
    AUCTION_SORT_OPTIONS.find((option) => option.value === value)?.label ??
    "Sort";

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={cn(
          "h-10 gap-1.5 px-3.5",
          open && "border-primary bg-primary/10 text-primary",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
      >
        <ArrowUpDown className="size-3.5" />
        {value === AuctionSort.NONE ? "Sort" : `Sort by · ${selectedLabel}`}
      </Button>

      {open ? (
        <div
          role="listbox"
          aria-label="Sort auctions"
          className="absolute top-[calc(100%+0.4rem)] right-0 z-20 w-56 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lg shadow-primary/10"
        >
          <p className="px-2.5 pt-1.5 pb-1 text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase">
            Sort by
          </p>
          {AUCTION_SORT_OPTIONS.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  selected
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-foreground hover:bg-muted",
                )}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
                {selected ? <Check className="size-3.5 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
