"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RejectAuctionDialog({
  open,
  title,
  isLoading = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  isLoading?: boolean;
  onConfirm: (rejectionReason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) {
      setReason("");
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isLoading) onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, isLoading, onClose]);

  if (!open) return null;

  const displayTitle = title.trim() || "Untitled";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-dialog-title"
      aria-describedby="reject-dialog-description"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
      onClick={() => {
        if (!isLoading) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-card p-4 shadow-xl shadow-black/10 ring-1 ring-border sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <X className="size-4" />
          </span>

          <div className="min-w-0 space-y-1">
            <h2
              id="reject-dialog-title"
              className="text-sm font-semibold text-foreground"
            >
              Reject &ldquo;{displayTitle}&rdquo;?
            </h2>
            <p
              id="reject-dialog-description"
              className="text-sm text-muted-foreground"
            >
              Tell the seller why this auction is being rejected.
            </p>
          </div>
        </div>

        <label className="mt-4 block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Rejection reason
          </span>
          <textarea
            rows={4}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain why this auction is being rejected"
            disabled={isLoading}
            autoFocus
            className="w-full min-w-0 rounded-lg border border-input bg-transparent px-3.5 py-2.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoading || !reason.trim()}
            onClick={() => onConfirm(reason.trim())}
            className="bg-destructive text-white hover:bg-destructive/90 focus-visible:border-destructive focus-visible:ring-destructive/30"
          >
            {isLoading ? "Rejecting..." : "Reject auction"}
          </Button>
        </div>
      </div>
    </div>
  );
}
