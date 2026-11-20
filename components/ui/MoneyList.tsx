import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TruncatedText } from "@/components/ui/TruncatedText";
import { titleInitial } from "@/lib/format";
import { cn } from "@/lib/utils";

type Tone = "amber" | "emerald" | "destructive";

const TONE_ROW: Record<Tone, string> = {
  amber: "hover:bg-amber-500/5",
  emerald: "hover:bg-emerald-500/5",
  destructive: "bg-destructive/4 hover:bg-destructive/8",
};

const TONE_AVATAR: Record<Tone, string> = {
  amber: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  emerald: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
  destructive: "bg-destructive/15 text-destructive",
};

export type MoneyListItem = {
  id: string;
  href: string;
  title: string;
  status: string;
  statusClassName: string;
  amount: string;
  tone: Tone;
  description?: ReactNode;
  hint?: string;
  action?: ReactNode;
};

export function MoneyListTabs({
  label,
  tabs,
  value,
  counts,
  onChange,
}: {
  label: string;
  tabs: { value: string; label: string }[];
  value: string;
  counts: Record<string, number>;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex max-w-full flex-wrap rounded-xl border border-border/80 bg-muted/40 p-1"
    >
      {tabs.map((tab) => {
        const selected = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
              selected
                ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "tabular-nums",
                selected ? "text-primary" : "opacity-70",
              )}
            >
              {counts[tab.value] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function MoneyList({
  loading,
  error,
  empty,
  header,
  footer,
  emptyTab,
  items,
}: {
  loading?: boolean;
  error?: string | null;
  empty?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  emptyTab?: string;
  items: MoneyListItem[];
}) {
  if (loading) {
    return (
      <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        <div className="space-y-3 px-4 py-4 sm:px-5">
          <div className="h-10 w-48 animate-pulse rounded-xl bg-muted" />
          <div className="divide-y divide-border/70">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 py-3.5">
                <div className="size-12 shrink-0 animate-pulse rounded-xl bg-muted" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-4 w-14 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        <p className="px-4 py-5 text-sm text-destructive sm:px-5">{error}</p>
      </section>
    );
  }

  if (empty) {
    return (
      <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        <div className="px-4 py-6 sm:px-5">{empty}</div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
      <div className="space-y-3 px-4 py-3.5 sm:px-5">
        {header}
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {emptyTab}
          </p>
        ) : (
          <>
            <ul className="divide-y divide-border/70">
              {items.map((item) => (
                <li key={item.id}>
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-1.5 py-3.5 transition-colors sm:gap-3 sm:px-2",
                      TONE_ROW[item.tone],
                    )}
                  >
                    <Link
                      href={item.href}
                      className="group flex min-w-0 flex-1 items-center gap-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <span
                        className={cn(
                          "inline-flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-semibold tracking-wide",
                          TONE_AVATAR[item.tone],
                        )}
                      >
                        {titleInitial(item.title)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                          <TruncatedText
                            as="span"
                            text={item.title}
                            limit={40}
                            className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary"
                          />
                          <span
                            className={cn(
                              "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                              item.statusClassName,
                            )}
                          >
                            {item.status}
                          </span>
                        </div>
                        {item.description}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-0.5">
                        <p
                          className={cn(
                            "text-base font-semibold tabular-nums tracking-tight",
                            item.tone === "emerald"
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-foreground",
                          )}
                        >
                          {item.amount}
                        </p>
                        {item.hint ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            {item.hint}
                            <ArrowRight
                              className="size-3 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                              aria-hidden
                            />
                          </span>
                        ) : null}
                      </div>
                    </Link>
                    {item.action}
                  </div>
                </li>
              ))}
            </ul>
            {footer}
          </>
        )}
      </div>
    </section>
  );
}
