"use client";

import { AdminUsersTable } from "./AdminUsersTable";
import { useAdminUsers } from "@/services/hooks/AdminServicesHook";

export function AdminUsersPage() {
  const { data: users = [], isPending, isError, error } = useAdminUsers();

  return (
    <AdminUsersTable
      users={users}
      isPending={isPending}
      isError={isError}
      error={error}
    />
  );
}

export { AdminUsersTable } from "./AdminUsersTable";
