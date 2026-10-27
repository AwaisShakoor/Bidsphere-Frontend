"use client";

import { getUserRoleClass } from "@/lib/constants/userRoles";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/services/types/AdminServicesTypes";

type AdminUsersTabProps = {
  users: AdminUser[];
  isPending?: boolean;
  isError?: boolean;
  errorMessage?: string;
};

const GRID =
  "sm:grid-cols-[minmax(0,1.4fr)_minmax(10rem,1.2fr)_6.5rem_minmax(8rem,1fr)]";

export function AdminUsersTab({
  users,
  isPending = false,
  isError = false,
  errorMessage,
}: AdminUsersTabProps) {
  if (isPending) {
    return (
      <div className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border-b border-border px-4 py-4 last:border-b-0"
          >
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-1/4 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {errorMessage || "Could not load users."}
      </p>
    );
  }

  if (users.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
        <p className="text-sm font-medium text-foreground">No users found</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Registered buyers and sellers will appear here.
        </p>
      </section>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
      <div
        className={`hidden gap-3 border-b border-border px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:grid sm:items-center ${GRID}`}
      >
        <span>User</span>
        <span>Email</span>
        <span>Role</span>
        <span>Joined</span>
      </div>

      <ul className="divide-y divide-border">
        {users.map((user) => {
          const roleClass = getUserRoleClass(user.role);

          return (
            <li
              key={user.id}
              className={`grid gap-3 px-4 py-4 sm:items-center ${GRID}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {user.firstName.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground sm:hidden">
                    {user.email}
                  </p>
                </div>
              </div>

              <p className="hidden truncate text-sm text-muted-foreground sm:block">
                {user.email}
              </p>

              <div>
                <span
                  className={cn(
                    "text-xs font-medium capitalize",
                    roleClass
                      ? cn("inline-flex rounded-md px-2 py-0.5", roleClass)
                      : "text-muted-foreground",
                  )}
                >
                  {user.role.toLowerCase()}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                <span className="mb-0.5 block text-xs tracking-wide text-muted-foreground uppercase sm:hidden">
                  Joined
                </span>
                {formatDate(user.createdAt)}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
