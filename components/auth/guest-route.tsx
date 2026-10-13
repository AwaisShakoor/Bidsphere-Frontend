"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { BidSphereLoader } from "@/components/ui/bidsphere-loader";
import { getDashboardPath } from "@/lib/auth/dashboard-path";
import { useMe } from "@/services/hooks/AuthServicesHook";

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: meData, isLoading, isSuccess } = useMe();

  useEffect(() => {
    if (!isLoading && isSuccess && meData?.user) {
      router.push(getDashboardPath(meData.user.role));
    }
  }, [isLoading, isSuccess, meData, router]);

  if (isLoading) {
    return <BidSphereLoader fullScreen text="Loading..." />;
  }

  if (meData?.user) {
    return null;
  }

  return <>{children}</>;
}
