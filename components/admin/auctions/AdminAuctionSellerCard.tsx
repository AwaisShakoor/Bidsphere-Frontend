import { BadgeCheck, Mail } from "lucide-react";
import type { AdminAuctionSeller } from "@/services/types/AdminServicesTypes";

export function AdminAuctionSellerCard({
  seller,
}: {
  seller: AdminAuctionSeller;
}) {
  const fullName = `${seller.firstName} ${seller.lastName}`.trim();
  const initials =
    `${seller.firstName.charAt(0)}${seller.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="flex flex-col gap-3 border-b border-primary/10 bg-primary/8 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20">
          {initials}
        </span>

        <div className="min-w-0 space-y-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold tracking-wide text-primary-foreground uppercase">
            <BadgeCheck className="size-3" aria-hidden />
            Seller
          </span>
          <p className="truncate text-sm font-semibold text-foreground">
            {fullName}
          </p>
          <a
            href={`mailto:${seller.email}`}
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary/20 bg-card px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <Mail className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{seller.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
