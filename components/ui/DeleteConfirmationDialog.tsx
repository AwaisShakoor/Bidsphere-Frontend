"use client";

import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteConfirmationDialog({
  open,
  name,
  isLoading = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  name: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

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

  const displayName = name.trim() || "Untitled";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
      onClick={() => {
        if (!isLoading) onClose();
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-card p-4 shadow-xl shadow-black/10 ring-1 ring-border"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Trash2 className="size-4" />
          </span>

          <div className="min-w-0 space-y-1">
            <h2
              id="delete-dialog-title"
              className="text-sm font-semibold text-foreground"
            >
              Delete &ldquo;{displayName}&rdquo;?
            </h2>
            <p
              id="delete-dialog-description"
              className="text-sm text-muted-foreground"
            >
              This will permanently remove it. This action cannot be undone.
            </p>
          </div>
        </div>

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
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-white hover:bg-destructive/90 focus-visible:border-destructive focus-visible:ring-destructive/30"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
