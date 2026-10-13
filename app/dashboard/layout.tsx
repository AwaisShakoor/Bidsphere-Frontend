import type { ReactNode } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppNavbar } from "@/components/layout/app-navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-full flex-1 flex-col bg-background">
        <AppNavbar />
        {children}
      </div>
    </ProtectedRoute>
  );
}
