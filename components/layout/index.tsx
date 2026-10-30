"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gavel, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/enums/userRole";
import { getAuthRedirectPath } from "@/lib/auth/routes";
import { cn } from "@/lib/utils";
import { useLogout, useMe } from "@/services/hooks/AuthServicesHook";

export function Navbar() {
  const pathname = usePathname();
  const { data: meData, isPending: isMePending } = useMe();
  const logout = useLogout();
  const user = meData?.user;
  const isSeller = user?.role === UserRole.SELLER;
  const isSellActive = pathname.startsWith("/my-auctions");
  const homeHref = getAuthRedirectPath(user?.role);

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/login";
      },
    });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/90 backdrop-blur-md">
      <div className="app-container flex h-16 items-center gap-4">
        <Link
          href={homeHref}
          className="shrink-0 text-sm font-semibold tracking-[0.18em] text-primary uppercase"
        >
          BidSphere
        </Link>

        <div className="min-w-0 flex-1" />

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isSeller ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className={cn(
                "h-9 gap-2 rounded-full border-border/80 bg-background px-3.5 text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                isSellActive &&
                  "border-primary/40 bg-primary/10 text-primary shadow-none hover:bg-primary/15 hover:text-primary",
              )}
            >
              <Link
                href="/my-auctions"
                aria-current={isSellActive ? "page" : undefined}
              >
                <Gavel className="size-3.5" />
                <span className="hidden sm:inline">Sell</span>
              </Link>
            </Button>
          ) : null}

          {isMePending ? (
            <div className="hidden h-10 w-28 animate-pulse rounded-full bg-muted/60 sm:block" />
          ) : user ? (
            <div className="hidden items-center gap-2.5 rounded-full bg-muted/60 py-1 pr-3 pl-1 sm:flex">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {user.firstName.charAt(0).toUpperCase()}
              </span>
              <div className="pr-1 leading-tight">
                <p className="text-sm font-medium text-foreground">
                  {user.firstName}
                </p>
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  {user.role.toLowerCase()}
                </p>
              </div>
            </div>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">
              {logout.isPending ? "..." : "Log out"}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
