import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout";
import { UserRole } from "@/enums/userRole";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute roles={[UserRole.ADMIN]}>
      <div className="flex min-h-full flex-1 flex-col bg-background">
        <Navbar />

        <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col lg:flex-row">
          <aside className="border-b border-primary/20 bg-primary/5 lg:w-60 lg:border-r lg:border-b-0">
            <AdminSidebar />
          </aside>

          <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
