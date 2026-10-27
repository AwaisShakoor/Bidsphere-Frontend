import { Shield } from "lucide-react";

export function AdminPageHeader({
  title = "Admin dashboard",
  description = "Review auctions, manage users, and keep the platform running.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
          <Shield className="size-4" aria-hidden />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </header>
  );
}
