"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { BidSphereLoader } from "@/components/ui/bidsphere-loader";
import { UserRole } from "@/enums/userRole";
import { useMe } from "@/services/hooks/AuthServicesHook";

export function SellerRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: meData, isLoading } = useMe();
  const user = meData?.user;
  const isSeller =
    user?.role === UserRole.SELLER || user?.role === UserRole.ADMIN;

  useEffect(() => {
    if (!isLoading && user && !isSeller) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, isSeller, router]);

  if (isLoading || !user) {
    return <BidSphereLoader text="Loading..." />;
  }

  if (!isSeller) {
    return null;
  }

  return <>{children}</>;
}
