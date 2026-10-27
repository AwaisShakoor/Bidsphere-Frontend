"use client";

import { useEffect, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DeleteConfirmationDialog({
  open,
  name,
  isLoading = false,
  onConfirm,
  onClose,
  title,
  description = "This will permanently remove it. This action cannot be undone.",
  confirmLabel = "Delete",
  loadingLabel = "Deleting...",
  icon = <Trash2 className="size-4" />,
  variant = "destructive",
}: {
  open: boolean;
  name: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  loadingLabel?: string;
  icon?: ReactNode;
  variant?: "destructive" | "default";
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
  const heading = title ?? `Delete “${displayName}”?`;
  const isDestructive = variant === "destructive";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
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
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              isDestructive
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary",
            )}
          >
            {icon}
          </span>

          <div className="min-w-0 space-y-1">
            <h2
              id="confirm-dialog-title"
              className="text-sm font-semibold text-foreground"
            >
              {heading}
            </h2>
            <p
              id="confirm-dialog-description"
              className="text-sm text-muted-foreground"
            >
              {description}
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
            className={
              isDestructive
                ? "bg-destructive text-white hover:bg-destructive/90 focus-visible:border-destructive focus-visible:ring-destructive/30"
                : undefined
            }
          >
            {isLoading ? loadingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
