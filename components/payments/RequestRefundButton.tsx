"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { RequestRefundDialog } from "./RequestRefundDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RequestRefundButtonProps = {
  itemId: string;
  itemTitle: string;
  className?: string;
};

export function RequestRefundButton({
  itemId,
  itemTitle,
  className,
}: RequestRefundButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          "h-8 gap-1.5 border-amber-500/30 px-2.5 text-amber-800 hover:bg-amber-500/10 hover:text-amber-900 dark:text-amber-200 dark:hover:text-amber-100",
          className,
        )}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
      >
        <RotateCcw className="size-3.5" aria-hidden />
        Request refund
      </Button>
      <RequestRefundDialog
        open={open}
        itemId={itemId}
        itemTitle={itemTitle}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
