"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/Loader";
import { UserRole } from "@/enums/userRole";
import { getAuthRedirectPath } from "@/lib/auth/routes";
import { useMe } from "@/services/hooks/AuthServicesHook";

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: UserRole[];
};

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const router = useRouter();
  const { data: meData, isPending, isError } = useMe();
  const user = meData?.user;
  const isAllowed = !roles || (user ? roles.includes(user.role) : false);

  useEffect(() => {
    if (isPending) return;

    if (isError || !user) {
      router.push("/login");
      return;
    }

    if (!isAllowed) {
      router.push(getAuthRedirectPath(user.role));
    }
  }, [isPending, isError, user, isAllowed, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader label="Authenticating..." variant="orbit" />
      </div>
    );
  }

  if (!user || !isAllowed) {
    return null;
  }

  return <>{children}</>;
}
