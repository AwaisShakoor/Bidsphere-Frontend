"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gavel, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/enums/userRole";
import { cn } from "@/lib/utils";
import { useLogout, useMe } from "@/services/hooks/AuthServicesHook";

export function Navbar() {
  const pathname = usePathname();
  const { data: meData, isPending: isMePending } = useMe();
  const logout = useLogout();
  const user = meData?.user;
  const isSeller = user?.role === UserRole.SELLER;
  const isSellActive = pathname.startsWith("/my-auctions");
  const isLoginActive = pathname.startsWith("/login");
  const isRegisterActive = pathname.startsWith("/register");

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/";
      },
    });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-card/85 shadow-sm shadow-primary/5 backdrop-blur-md">
      <div className="app-container flex h-16 items-center gap-3 sm:gap-4">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/25 transition-transform group-hover:scale-[1.03]">
            B
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="font-heading block text-sm font-semibold tracking-tight text-foreground">
              BidSphere
            </span>
            <span className="block text-[11px] tracking-[0.14em] text-primary uppercase">
              Marketplace
            </span>
          </span>
        </Link>

        <div className="min-w-0 flex-1" />

        <div className="flex shrink-0 items-center gap-2">
          {isSeller ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className={cn(
                "h-9 gap-2 rounded-lg border-border/80 bg-background px-3 text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
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
            <div className="flex items-center gap-2">
              <div className="h-9 w-20 animate-pulse rounded-lg bg-muted/70" />
              <div className="h-9 w-24 animate-pulse rounded-lg bg-muted/70" />
            </div>
          ) : user ? (
            <>
              <div className="hidden items-center gap-2.5 rounded-lg bg-muted/50 py-1 pr-3 pl-1 ring-1 ring-border/60 sm:flex">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
                  {user.firstName.charAt(0).toUpperCase()}
                </span>
                <div className="pr-0.5 leading-tight">
                  <p className="text-sm font-medium text-foreground">
                    {user.firstName}
                  </p>
                  <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                    {user.role.toLowerCase()}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 gap-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={handleLogout}
                disabled={logout.isPending}
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">
                  {logout.isPending ? "..." : "Log out"}
                </span>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl bg-muted/40 p-1 ring-1 ring-border/70 sm:gap-2 sm:p-1.5">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 gap-1.5 rounded-lg px-3 font-medium text-foreground hover:bg-background hover:text-primary",
                  isLoginActive && "bg-background text-primary shadow-sm",
                )}
              >
                <Link
                  href="/login"
                  aria-current={isLoginActive ? "page" : undefined}
                >
                  <LogIn className="size-3.5" />
                  Log in
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className={cn(
                  "h-9 rounded-lg px-3.5 font-medium shadow-sm shadow-primary/15",
                  isRegisterActive && "ring-2 ring-primary/30",
                )}
              >
                <Link
                  href="/register"
                  aria-current={isRegisterActive ? "page" : undefined}
                >
                  Sign up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
