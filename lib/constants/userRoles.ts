import { UserRole } from "@/enums/userRole";

export const USER_ROLE_CLASS: Partial<Record<UserRole, string>> = {
  [UserRole.SELLER]: "bg-amber-500/10 text-amber-700",
  [UserRole.BUYER]: "bg-muted text-muted-foreground",
};

export function getUserRoleClass(role: UserRole) {
  return USER_ROLE_CLASS[role] ?? "";
}
