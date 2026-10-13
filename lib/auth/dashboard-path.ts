import type { UserRole } from "@/enums/userRole";

/** Shared home for all roles after login */
export function getDashboardPath(_role?: UserRole) {
  return "/dashboard";
}
