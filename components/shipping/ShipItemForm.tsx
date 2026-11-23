"use client";

import { useState, type FormEvent } from "react";
import { Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShipItem } from "@/services/hooks/PaymentServicesHook";
import { cn } from "@/lib/utils";

type ShipItemFormProps = {
  itemId: string;
  className?: string;
  compact?: boolean;
};

export function ShipItemForm({
  itemId,
  className,
  compact = false,
}: ShipItemFormProps) {
  const { mutate: shipItem, isPending } = useShipItem();
  const [trackingNote, setTrackingNote] = useState("");

  function handleShip(event: FormEvent) {
    event.preventDefault();
    shipItem({
      itemId,
      trackingNote: trackingNote.trim() || undefined,
    });
  }

  return (
    <form
      onSubmit={handleShip}
      onClick={(event) => event.stopPropagation()}
      className={cn(
        "overflow-hidden rounded-xl border border-amber-500/25 bg-linear-to-br from-amber-500/12 via-card to-card p-4 shadow-sm shadow-amber-500/5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/25 dark:text-amber-300">
          <Package className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Ship this item
            </p>
            {!compact ? (
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Buyer has paid. Mark as shipped when you send it — payout stays
                held until the buyer confirms delivery.
              </p>
            ) : (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Add an optional tracking note, then mark as shipped.
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor={`tracking-note-${itemId}`}
              className="text-sm font-medium text-foreground"
            >
              Tracking note{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <textarea
              id={`tracking-note-${itemId}`}
              rows={2}
              value={trackingNote}
              onChange={(event) => setTrackingNote(event.target.value)}
              placeholder="Tracking ID, carrier, or other shipping details"
              disabled={isPending}
              className="border-input bg-card placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full resize-y rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="h-8 gap-1.5 px-3.5 shadow-sm shadow-primary/25"
          >
            <Truck className="size-3.5" aria-hidden />
            {isPending ? "Shipping…" : "Mark as shipped"}
          </Button>
        </div>
      </div>
    </form>
  );
}
