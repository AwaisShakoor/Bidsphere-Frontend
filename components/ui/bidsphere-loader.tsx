import { cn } from "@/lib/utils";

type BidSphereLoaderProps = {
  text?: string;
  fullScreen?: boolean;
  className?: string;
};

export function BidSphereLoader({
  text = "Loading...",
  fullScreen = false,
  className,
}: BidSphereLoaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullScreen ? "min-h-screen bg-background" : "min-h-64 flex-1 py-16",
        className,
      )}
    >
      <p className="animate-pulse text-sm font-medium text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
