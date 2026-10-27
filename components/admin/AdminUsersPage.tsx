"use client";

import { AdminUsersTab } from "@/components/admin/AdminUsersTab";
import { useAdminUsers } from "@/services/hooks/AdminServicesHook";

export function AdminUsersPage() {
  const {
    data: users = [],
    isPending,
    isError,
    error,
  } = useAdminUsers();

  return (
    <AdminUsersTab
      users={users}
      isPending={isPending}
      isError={isError}
    />
  );
}
