import type { ReactNode } from "react";

import { GuestRoute } from "@/components/auth/guest-route";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <GuestRoute>
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-background px-4 py-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-primary/10 blur-3xl"
        />
        <div className="relative w-full">{children}</div>
      </div>
    </GuestRoute>
  );
}
