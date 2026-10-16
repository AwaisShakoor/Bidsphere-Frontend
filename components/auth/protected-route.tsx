"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BidSphereLoader } from "@/components/ui/bidsphere-loader";
import { useMe } from "@/services/hooks/AuthServicesHook";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: meData, isLoading, isError } = useMe();

  useEffect(() => {
    if (!isLoading && (isError || !meData?.user)) {
      router.push("/login");
    }
  }, [isLoading, isError, meData, router]);

  if (isLoading) {
    return <BidSphereLoader fullScreen text="Authenticating..." />;
  }

  if (!meData?.user) {
    return null;
  }

  return <>{children}</>;
}
