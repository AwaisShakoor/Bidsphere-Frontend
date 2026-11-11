import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm shadow-primary/5">
      {icon ? (
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </span>
      ) : null}
      <div className="space-y-1.5">
        <p className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </p>
        {description ? (
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
