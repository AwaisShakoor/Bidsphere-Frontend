import type { ReactNode } from "react";
import { Navbar } from "@/components/layout";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <Navbar />
      {children}
    </div>
  );
}
