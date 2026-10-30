"use client";

import {
  ADMIN_USERS_TABLE_GRID,
  adminUsersTableColumns,
} from "./adminUsersTableColumns";
import { DataTable } from "@/components/ui/DataTable";
import { Loader } from "@/components/ui/Loader";
import type { AdminUser } from "@/services/types/AdminServicesTypes";

type AdminUsersTableProps = {
  users: AdminUser[];
  isPending?: boolean;
  isError?: boolean;
  error?: Error | null;
};

export function AdminUsersTable({
  users,
  isPending = false,
  isError = false,
  error = null,
}: AdminUsersTableProps) {
  if (isPending) {
    return <Loader label="Loading users..." />;
  }

  return (
    <DataTable
      columns={adminUsersTableColumns}
      data={users}
      getRowKey={(user) => user.id}
      gridClassName={ADMIN_USERS_TABLE_GRID}
      isError={isError}
      error={error}
      emptyTitle="No users found"
      emptyDescription="Buyers and sellers will show up here once they create accounts."
      filterPlaceholder="Search users..."
    />
  );
}
