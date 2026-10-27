"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  accessorKey: string;
  header: string;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
};

type SortDirection = "asc" | "desc";

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  gridClassName: string;
  isPending?: boolean;
  isError?: boolean;
  error?: Error | null;
  emptyTitle?: string;
  onRowClick?: (row: T) => void;
  enableFilter?: boolean;
  enableSort?: boolean;
  filterPlaceholder?: string;
};

function getAccessorValue<T>(row: T, accessorKey: string): unknown {
  return (row as Record<string, unknown>)[accessorKey];
}

function toComparableString(value: unknown): string {
  if (value == null) return "";
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return String(value.length);
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return [record.firstName, record.lastName, record.email, record.title]
      .filter(Boolean)
      .join(" ");
  }
  return String(value);
}

function getCellValue<T>(row: T, column: DataTableColumn<T>): ReactNode {
  if (column.cell) return column.cell(row);

  const value = getAccessorValue(row, column.accessorKey);
  if (value == null || value === "") return "—";
  return String(value);
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  gridClassName,
  isPending = false,
  isError = false,
  error = null,
  emptyTitle = "No results",
  onRowClick,
  enableFilter = true,
  enableSort = true,
  filterPlaceholder = "Search...",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();

    let next = data;

    if (query) {
      const filterColumns = columns.filter(
        (column) => column.filterable !== false,
      );

      next = next.filter((row) =>
        filterColumns.some((column) =>
          toComparableString(getAccessorValue(row, column.accessorKey))
            .toLowerCase()
            .includes(query),
        ),
      );
    }

    if (sortKey) {
      next = [...next].sort((a, b) => {
        const left = toComparableString(
          getAccessorValue(a, sortKey),
        ).toLowerCase();
        const right = toComparableString(
          getAccessorValue(b, sortKey),
        ).toLowerCase();
        const result = left.localeCompare(right, undefined, { numeric: true });
        return sortDirection === "asc" ? result : -result;
      });
    }

    return next;
  }, [columns, data, search, sortDirection, sortKey]);

  function handleSort(column: DataTableColumn<T>) {
    if (!enableSort || column.sortable === false) return;

    if (sortKey !== column.accessorKey) {
      setSortKey(column.accessorKey);
      setSortDirection("asc");
      return;
    }

    if (sortDirection === "asc") {
      setSortDirection("desc");
      return;
    }

    setSortKey(null);
    setSortDirection("asc");
  }

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {error?.message || "Could not load data."}
      </p>
    );
  }

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyTitle}</p>;
  }

  return (
    <div className="space-y-3">
      {enableFilter ? (
        <label className="relative block max-w-sm">
          <span className="sr-only">Search table</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={filterPlaceholder}
            className="h-10 w-full rounded-xl border border-border bg-card pr-3 pl-9 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          />
        </label>
      ) : null}

      <div className="overflow-x-auto rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        <div
          className={cn(
            "grid items-center gap-3 border-b border-border px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase",
            gridClassName,
          )}
        >
          {columns.map((column) => {
            const canSort = enableSort && column.sortable !== false;
            const isActive = sortKey === column.accessorKey;
            const SortIcon = !isActive
              ? ArrowUpDown
              : sortDirection === "asc"
                ? ArrowUp
                : ArrowDown;

            if (!canSort) {
              return <span key={column.accessorKey}>{column.header}</span>;
            }

            return (
              <button
                key={column.accessorKey}
                type="button"
                onClick={() => handleSort(column)}
                className={cn(
                  "inline-flex items-center gap-1.5 text-left uppercase transition-colors hover:text-foreground",
                  isActive && "text-foreground",
                )}
              >
                {column.header}
                <SortIcon
                  className="size-3.5 shrink-0 opacity-70"
                  aria-hidden
                />
              </button>
            );
          })}
        </div>

        {rows.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted-foreground">
            No results match your search.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row) => (
              <li
                key={getRowKey(row)}
                className={cn(
                  "grid items-center gap-3 px-4 py-4",
                  gridClassName,
                  onRowClick &&
                    "cursor-pointer transition-colors hover:bg-muted/40",
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column) => (
                  <div key={column.accessorKey}>
                    {getCellValue(row, column)}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
