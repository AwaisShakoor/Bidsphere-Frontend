"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Authenticating...
        </p>
      </div>
    );
  }

  if (!meData?.user) {
    return null;
  }

  return <>{children}</>;
}
