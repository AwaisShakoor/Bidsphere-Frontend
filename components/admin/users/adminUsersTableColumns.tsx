import type { DataTableColumn } from "@/components/ui/DataTable";
import { getUserRoleClass } from "@/lib/constants/userRoles";
import { formatDate, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/services/types/AdminServicesTypes";

export const ADMIN_USERS_TABLE_GRID =
  "grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(10rem,1.3fr)_6.5rem_minmax(8rem,1fr)]";

export const adminUsersTableColumns: DataTableColumn<AdminUser>[] = [
  {
    accessorKey: "firstName",
    header: "First name",
    cell: (user) => (
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {user.firstName.charAt(0).toUpperCase()}
        </span>
        <p className="truncate text-sm font-semibold text-foreground">
          {user.firstName}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "lastName",
    header: "Last name",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (user) => (
      <p className="truncate text-sm text-muted-foreground">{user.email}</p>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (user) => {
      const roleClass = getUserRoleClass(user.role);

      return (
        <span
          className={cn(
            "text-xs font-medium",
            roleClass
              ? cn("inline-flex rounded-md px-2 py-0.5", roleClass)
              : "text-muted-foreground",
          )}
        >
          {formatSnakeCase(user.role)}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: (user) => (
      <p className="text-sm text-muted-foreground">
        {formatDate(user.createdAt)}
      </p>
    ),
  },
];
