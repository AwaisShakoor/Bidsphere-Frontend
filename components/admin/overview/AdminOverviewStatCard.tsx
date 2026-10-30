import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type StatTone = "primary" | "amber" | "emerald" | "rose" | "muted";

const TONE_STYLES: Record<
  StatTone,
  { accent: string; icon: string; wash: string }
> = {
  primary: {
    accent: "bg-primary",
    icon: "bg-primary/15 text-primary",
    wash: "from-primary/8 to-transparent",
  },
  amber: {
    accent: "bg-amber-500",
    icon: "bg-amber-100 text-amber-700",
    wash: "from-amber-50 to-transparent",
  },
  emerald: {
    accent: "bg-emerald-500",
    icon: "bg-emerald-100 text-emerald-700",
    wash: "from-emerald-50 to-transparent",
  },
  rose: {
    accent: "bg-rose-500",
    icon: "bg-rose-100 text-rose-700",
    wash: "from-rose-50 to-transparent",
  },
  muted: {
    accent: "bg-muted-foreground/40",
    icon: "bg-muted text-muted-foreground",
    wash: "from-muted/80 to-transparent",
  },
};

export function AdminOverviewStatCard({
  icon,
  label,
  value,
  hint,
  href,
  tone = "primary",
}: {
  icon: ReactNode;
  label: string;
  value: number;
  hint?: string;
  href?: string;
  tone?: StatTone;
}) {
  const styles = TONE_STYLES[tone];

  const content = (
    <>
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-1 rounded-l-2xl",
          styles.accent,
        )}
        aria-hidden
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-linear-to-br opacity-90",
          styles.wash,
        )}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm shadow-black/5",
            styles.icon,
          )}
        >
          {icon}
        </span>

        {href ? (
          <span className="flex size-8 items-center justify-center rounded-full bg-background/70 text-muted-foreground ring-1 ring-border/70 transition-colors group-hover:text-primary group-hover:ring-primary/25">
            <ArrowUpRight className="size-3.5" aria-hidden />
          </span>
        ) : null}
      </div>

      <div className="relative mt-5 min-w-0">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-1.5 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
          {value}
        </p>
        {hint ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    </>
  );

  const className = cn(
    "group relative overflow-hidden rounded-2xl border border-primary/15 bg-card p-4 pl-5 shadow-sm shadow-primary/5",
    href &&
      "transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
