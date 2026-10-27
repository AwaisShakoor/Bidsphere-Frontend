import { cn } from "@/lib/utils";

type LoaderVariant = "ring" | "orbit";

function RingSpinner() {
  return (
    <div className="relative size-8" aria-hidden="true">
      <span className="absolute inset-0 rounded-full border-2 border-primary/15" />
      <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-primary/40" />
      <span
        className="absolute inset-1.5 animate-spin rounded-full border-2 border-transparent border-b-primary/70"
        style={{ animationDirection: "reverse", animationDuration: "1.25s" }}
      />
      <span className="absolute inset-0 m-auto size-1 rounded-full bg-primary" />
    </div>
  );
}

function OrbitSpinner() {
  return (
    <div className="relative size-8" aria-hidden="true">
      <span className="absolute inset-3 rounded-full bg-primary/20" />
      <span
        className="absolute inset-0 animate-spin"
        style={{ animationDuration: "1.1s" }}
      >
        <span className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary" />
      </span>
      <span
        className="absolute inset-0 animate-spin"
        style={{
          animationDelay: "-0.35s",
          animationDirection: "reverse",
          animationDuration: "1.6s",
        }}
      >
        <span className="absolute top-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary/70" />
      </span>
      <span
        className="absolute inset-0 animate-spin"
        style={{ animationDelay: "-0.7s", animationDuration: "2s" }}
      >
        <span className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary/45" />
      </span>
    </div>
  );
}

export function Loader({
  label,
  variant = "ring",
  className,
}: {
  label?: string;
  variant?: LoaderVariant;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label || "Loading"}
      className={cn(
        "flex min-h-[min(32rem,70vh)] w-full flex-col items-center justify-center gap-3.5 pt-10 text-muted-foreground",
        className,
      )}
    >
      {variant === "orbit" ? <OrbitSpinner /> : <RingSpinner />}
      {label ? (
        <p className="text-sm font-medium tracking-wide">{label}</p>
      ) : null}
    </div>
  );
}
