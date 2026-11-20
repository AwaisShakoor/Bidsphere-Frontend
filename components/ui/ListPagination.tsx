"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { cn } from "@/lib/utils";

type ListPaginationProps = {
  page: number;
  total: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function ListPagination({
  page,
  total,
  pageSize = DEFAULT_PAGE_SIZE,
  onPageChange,
  className,
}: ListPaginationProps) {
  if (total <= pageSize) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(0, page), totalPages - 1);
  const from = currentPage * pageSize + 1;
  const to = Math.min(total, (currentPage + 1) * pageSize);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 pt-1",
        className,
      )}
    >
      <p className="text-xs text-muted-foreground tabular-nums">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <p className="min-w-16 text-center text-xs font-medium text-muted-foreground tabular-nums">
          {currentPage + 1} / {totalPages}
        </p>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={currentPage >= totalPages - 1}
          onClick={() =>
            onPageChange(Math.min(totalPages - 1, currentPage + 1))
          }
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
