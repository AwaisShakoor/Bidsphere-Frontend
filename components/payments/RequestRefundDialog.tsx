"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModalLock } from "@/hooks/useModalLock";
import { useRequestItemRefund } from "@/services/hooks/PaymentServicesHook";

export function RequestRefundDialog({
  open,
  itemId,
  itemTitle,
  onClose,
}: {
  open: boolean;
  itemId: string;
  itemTitle: string;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const { mutate: requestRefund, isPending } = useRequestItemRefund();

  function handleClose() {
    if (isPending) return;
    setReason("");
    onClose();
  }

  useModalLock({ open, onClose: handleClose, enabled: !isPending });

  if (!open) return null;

  const displayTitle = itemTitle.trim() || "Untitled item";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-refund-title"
      aria-describedby="request-refund-description"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-card p-4 shadow-xl shadow-black/10 ring-1 ring-border sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
            <RotateCcw className="size-4" />
          </span>
          <div className="min-w-0 space-y-1">
            <h2
              id="request-refund-title"
              className="text-sm font-semibold text-foreground"
            >
              Request refund for &ldquo;{displayTitle}&rdquo;?
            </h2>
            <p
              id="request-refund-description"
              className="text-sm text-muted-foreground"
            >
              Only available before the seller ships. An admin will review your
              request.
            </p>
          </div>
        </div>

        <label className="mt-4 block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Why do you need a refund?
          </span>
          <textarea
            rows={4}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g. Changed my mind before shipping"
            disabled={isPending}
            autoFocus
            className="w-full min-w-0 rounded-lg border border-input bg-transparent px-3.5 py-2.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending || !reason.trim()}
            onClick={() => {
              requestRefund(
                { itemId, reason: reason.trim() },
                {
                  onSuccess: () => {
                    setReason("");
                    onClose();
                  },
                },
              );
            }}
          >
            {isPending ? "Sending…" : "Submit request"}
          </Button>
        </div>
      </div>
    </div>
  );
}
