"use client";

import {
  CheckCircle2,
  Gavel,
  ShoppingBag,
  Store,
  Timer,
  XCircle,
} from "lucide-react";
import { AdminOverviewStatCard } from "./AdminOverviewStatCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Loader } from "@/components/ui/Loader";
import { useAdminOverview } from "@/services/hooks/AdminServicesHook";

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-primary uppercase">
      <span className="h-4 w-1 rounded-full bg-primary" aria-hidden />
      {children}
    </h2>
  );
}

export function AdminOverviewPage() {
  const { data, isPending, isError, error } = useAdminOverview();

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="A quick look at auctions and people across the platform."
      />

      {isPending ? <Loader /> : null}

      {isError ? (
        <p className="text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Could not load overview stats."}
        </p>
      ) : null}

      {data ? (
        <div className="flex flex-col gap-8">
          <section className="space-y-3">
            <SectionHeading>Auctions</SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <AdminOverviewStatCard
                tone="amber"
                icon={<Timer className="size-4" />}
                label="Pending approval"
                value={data.auctions.pendingApproval}
                hint="Waiting for review"
                href="/admin/auctions"
              />
              <AdminOverviewStatCard
                tone="emerald"
                icon={<Gavel className="size-4" />}
                label="Active"
                value={data.auctions.activeAuctions}
                hint="Live on the marketplace"
              />
              <AdminOverviewStatCard
                tone="rose"
                icon={<XCircle className="size-4" />}
                label="Rejected"
                value={data.auctions.rejectedAuctions}
                hint="Not approved"
              />
              <AdminOverviewStatCard
                tone="muted"
                icon={<CheckCircle2 className="size-4" />}
                label="Completed"
                value={data.auctions.completedAuctions}
                hint="Finished auctions"
              />
            </div>
          </section>

          <section className="space-y-3">
            <SectionHeading>Users</SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <AdminOverviewStatCard
                tone="primary"
                icon={<Store className="size-4" />}
                label="Sellers"
                value={data.users.sellers}
                hint="Listing on the platform"
                href="/admin/users"
              />
              <AdminOverviewStatCard
                tone="muted"
                icon={<ShoppingBag className="size-4" />}
                label="Buyers"
                value={data.users.buyers}
                hint="Browsing and bidding"
                href="/admin/users"
              />
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
