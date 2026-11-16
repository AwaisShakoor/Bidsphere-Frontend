"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { DATE_RANGE_OPTIONS, type DateRangePreset } from "@/lib/dateRange";
import { cn } from "@/lib/utils";

type DateRangeFilterProps = {
  value: DateRangePreset;
  onChange: (value: DateRangePreset) => void;
  className?: string;
  "aria-label"?: string;
};

export function DateRangeFilter({
  value,
  onChange,
  className,
  "aria-label": ariaLabel = "Filter by date range",
}: DateRangeFilterProps) {
  return (
    <div
      className={cn(
        "relative inline-flex h-9 items-center rounded-xl border border-border/80 bg-muted/40 text-xs font-medium text-foreground shadow-sm shadow-primary/5 transition-colors hover:bg-muted/60 focus-within:ring-3 focus-within:ring-ring/50",
        className,
      )}
    >
      <CalendarDays
        className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground"
        aria-hidden
      />
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value as DateRangePreset)}
        className="h-full cursor-pointer appearance-none rounded-xl bg-transparent py-0 pr-8 pl-9 text-xs font-medium text-foreground outline-none"
      >
        {DATE_RANGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 size-3.5 text-muted-foreground"
        aria-hidden
      />
    </div>
  );
}

type UseDateRangeFilterOptions = {
  defaultValue?: DateRangePreset;
  onChange?: (value: DateRangePreset) => void;
  className?: string;
  "aria-label"?: string;
};

export function useDateRangeFilter({
  defaultValue = "all",
  onChange,
  className,
  "aria-label": ariaLabel,
}: UseDateRangeFilterOptions = {}) {
  const [dateRange, setDateRange] = useState<DateRangePreset>(defaultValue);

  function handleChange(next: DateRangePreset) {
    setDateRange(next);
    onChange?.(next);
  }

  return {
    dateRange,
    filter: (
      <DateRangeFilter
        value={dateRange}
        onChange={handleChange}
        className={className}
        aria-label={ariaLabel}
      />
    ),
  };
}
