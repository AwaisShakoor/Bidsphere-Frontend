"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gavel, LayoutDashboard, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Auctions", href: "/admin/auctions", icon: Gavel },
  { label: "Users", href: "/admin/users", icon: Users },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin sections"
      className="flex gap-1.5 overflow-x-auto px-3 py-3 lg:h-full lg:flex-col lg:overflow-visible lg:px-3 lg:py-5"
    >
      {links.map(({ label, href, icon: Icon }) => {
        const active =
          href === "/admin" ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all lg:w-full",
              active
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "text-foreground/70 hover:bg-primary/10 hover:text-primary",
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0",
                active ? "text-primary-foreground" : "text-primary/70",
              )}
              aria-hidden
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
