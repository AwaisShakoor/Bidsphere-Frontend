import { cn } from "@/lib/utils";

type RefundReasonProps = {
  reason: string;
  className?: string;
  nested?: boolean;
};

export function RefundReason({
  reason,
  className,
  nested = false,
}: RefundReasonProps) {
  const text = reason.trim();
  if (!text) return null;

  if (nested) {
    return (
      <p className={cn("mt-1 text-[11px] leading-snug opacity-90", className)}>
        <span className="font-semibold">Reason:</span> {text}
      </p>
    );
  }

  return (
    <p
      className={cn(
        "w-full rounded-lg border border-border/80 bg-background/60 px-2.5 py-2 text-xs leading-relaxed text-foreground",
        className,
      )}
    >
      <span className="font-semibold text-muted-foreground">Reason: </span>
      {text}
    </p>
  );
}
