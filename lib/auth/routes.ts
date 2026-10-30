import { UserRole } from "@/enums/userRole";

export function getAuthRedirectPath(role?: UserRole | string | null) {
  if (role === UserRole.ADMIN) {
    return "/admin";
  }

  return "/dashboard";
}
