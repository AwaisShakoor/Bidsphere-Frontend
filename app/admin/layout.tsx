import type { ReactNode } from "react";
import { Shield } from "lucide-react";
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

          <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
            <header className="mb-8">
              <div className="mt-2 flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <Shield className="size-5" aria-hidden />
                </span>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Admin dashboard
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Review auctions, manage users, and keep the platform
                    running.
                  </p>
                </div>
              </div>
            </header>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
