"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLogout, useMe } from "@/services/hooks/AuthServicesHook";

export function DashboardHome() {
  const router = useRouter();
  const { data: meData } = useMe();
  const logout = useLogout();
  const user = meData?.user;

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
          BidSphere
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            logout.mutate(undefined, {
              onSuccess: () => router.push("/login"),
            })
          }
          disabled={logout.isPending}
        >
          {logout.isPending ? "Logging out..." : "Log out"}
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Hello, {user?.firstName}</h1>
        <div className="mt-6 rounded-2xl bg-card px-8 py-10 shadow-xl shadow-primary/10 ring-1 ring-border">
          <p className="text-sm text-muted-foreground">No auctions yet.</p>
        </div>
      </main>
    </div>
  );
}
