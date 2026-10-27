"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/Loader";
import { getAuthRedirectPath } from "@/lib/auth/routes";
import { useMe } from "@/services/hooks/AuthServicesHook";

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: meData, isPending, isSuccess } = useMe();

  useEffect(() => {
    if (!isPending && isSuccess && meData?.user) {
      router.push(getAuthRedirectPath(meData.user.role));
    }
  }, [isPending, isSuccess, meData, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader variant="orbit" />
      </div>
    );
  }

  if (meData?.user) {
    return null;
  }

  return <>{children}</>;
}
