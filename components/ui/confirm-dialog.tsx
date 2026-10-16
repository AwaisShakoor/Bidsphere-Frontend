"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeleteConfirmationDialogProps = {
  open: boolean;
  title?: string;
  text: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteConfirmationDialog({
  open,
  title = "Are you sure?",
  text,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isPending = false,
  destructive = false,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-foreground/45 backdrop-blur-sm"
        onClick={onCancel}
        disabled={isPending}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-text"
        className="relative z-10 w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl ring-1 ring-border"
      >
        <div className="space-y-2 text-center sm:text-left">
          <h2
            id="confirm-dialog-title"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            {title}
          </h2>
          <p
            id="confirm-dialog-text"
            className="text-sm leading-relaxed text-muted-foreground"
          >
            {text}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full"
            onClick={onCancel}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            className={cn(
              "h-11 w-full",
              destructive &&
                "bg-destructive text-white hover:bg-destructive/90 focus-visible:border-destructive focus-visible:ring-destructive/30",
            )}
            variant={destructive ? undefined : "default"}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Please wait..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
