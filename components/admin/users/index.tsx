"use client";

import { AdminUsersTable } from "./AdminUsersTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useAdminUsers } from "@/services/hooks/AdminServicesHook";

export function AdminUsersPage() {
  const { data: users = [], isPending, isError, error } = useAdminUsers();

  return (
    <>
      <AdminPageHeader
        title="Users"
        description="Browse buyers and sellers on the platform."
      />
      <AdminUsersTable
        users={users}
        isPending={isPending}
        isError={isError}
        error={error}
      />
    </>
  );
}

export { AdminUsersTable } from "./AdminUsersTable";
