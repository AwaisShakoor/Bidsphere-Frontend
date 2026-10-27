import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout";
import { UserRole } from "@/enums/userRole";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute roles={[UserRole.BUYER, UserRole.SELLER]}>
      <div className="flex min-h-full flex-1 flex-col bg-background">
        <Navbar />
        {children}
      </div>
    </ProtectedRoute>
  );
}
