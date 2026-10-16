import type { ReactNode } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Navbar } from "@/components/layout/navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-full flex-1 flex-col bg-background">
        <Navbar />
        {children}
      </div>
    </ProtectedRoute>
  );
}
