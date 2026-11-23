"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeliverItem } from "@/services/hooks/PaymentServicesHook";
import { cn } from "@/lib/utils";

type ConfirmDeliveryButtonProps = {
  itemId: string;
  className?: string;
  size?: "sm" | "default" | "lg";
};

export function ConfirmDeliveryButton({
  itemId,
  className,
  size = "sm",
}: ConfirmDeliveryButtonProps) {
  const { mutate: deliverItem, isPending } = useDeliverItem();

  return (
    <Button
      type="button"
      size={size}
      disabled={isPending}
      className={cn(
        "h-8 gap-1.5 px-3.5 shadow-sm shadow-primary/25",
        className,
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        deliverItem(itemId);
      }}
    >
      <CheckCircle2 className="size-3.5" aria-hidden />
      {isPending ? "Confirming…" : "Confirm delivery"}
    </Button>
  );
}
