import type { ReactNode } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";

export default function MyAuctionsLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-full flex-1 flex-col bg-background">
        <Navbar />
        {children}
      </div>
    </ProtectedRoute>
  );
}
