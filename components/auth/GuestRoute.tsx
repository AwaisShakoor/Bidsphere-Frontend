"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/services/hooks/AuthServicesHook";

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: meData, isLoading, isSuccess } = useMe();

  useEffect(() => {
    if (!isLoading && isSuccess && meData?.user) {
      router.push("/dashboard");
    }
  }, [isLoading, isSuccess, meData, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  if (meData?.user) {
    return null;
  }

  return <>{children}</>;
}
