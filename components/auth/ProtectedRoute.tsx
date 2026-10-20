"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/Loader";
import { useMe } from "@/services/hooks/AuthServicesHook";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: meData, isPending, isError } = useMe();

  useEffect(() => {
    if (!isPending && (isError || !meData?.user)) {
      router.push("/login");
    }
  }, [isPending, isError, meData, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader label="Authenticating..." variant="orbit" />
      </div>
    );
  }

  if (!meData?.user) {
    return null;
  }

  return <>{children}</>;
}
