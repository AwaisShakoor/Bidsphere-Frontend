import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
      <span className="h-4 w-1 rounded-full bg-primary" aria-hidden />
      {children}
    </h3>
  );
}

export function DetailRow({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-3 border-b border-border/80 py-2.5 last:border-b-0 sm:grid-cols-[10rem_minmax(0,1fr)]">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-sm font-medium",
          emphasize ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export function InfoCard({
  icon,
  label,
  value,
  hint,
  tone = "primary",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
  tone?: "primary" | "accent" | "muted";
}) {
  const toneClass =
    tone === "accent"
      ? "border-accent-foreground/15 bg-accent"
      : tone === "muted"
        ? "border-border bg-muted/60"
        : "border-primary/15 bg-primary/5";

  const iconClass =
    tone === "accent"
      ? "bg-accent-foreground/10 text-accent-foreground"
      : tone === "muted"
        ? "bg-muted-foreground/10 text-muted-foreground"
        : "bg-primary/15 text-primary";

  return (
    <div className={cn("rounded-2xl border p-4", toneClass)}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl",
            iconClass,
          )}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-foreground">
            {value}
          </p>
          {hint ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {hint}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
