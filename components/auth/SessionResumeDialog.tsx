"use client";

import { Button } from "@/components/ui/button";
import { useModalLock } from "@/hooks/useModalLock";

type SessionResumeDialogProps = {
  open: boolean;
  isLoggingOut?: boolean;
  onStayLoggedIn: () => void;
  onLogout: () => void;
};

export function SessionResumeDialog({
  open,
  isLoggingOut = false,
  onStayLoggedIn,
  onLogout,
}: SessionResumeDialogProps) {
  useModalLock({ open, onClose: () => {}, enabled: false });

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-resume-title"
      aria-describedby="session-resume-description"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-xl shadow-primary/10 ring-1 ring-border animate-in fade-in zoom-in-95 duration-200">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-primary/10"
        />

        <div className="relative space-y-5 px-6 pt-6 pb-5">
          <div className="space-y-2 text-center">
            <p className="text-xs font-medium tracking-wide text-primary uppercase">
              BidSphere
            </p>
            <h2
              id="session-resume-title"
              className="font-heading text-2xl font-semibold tracking-tight text-foreground"
            >
              Still you?
            </h2>
            <p
              id="session-resume-description"
              className="text-sm leading-relaxed text-muted-foreground"
            >
              You&apos;ve been away for a bit. Continue your session or log out.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              className="h-10 w-full shadow-sm shadow-primary/20"
              disabled={isLoggingOut}
              onClick={onStayLoggedIn}
            >
              Stay logged in
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full"
              disabled={isLoggingOut}
              onClick={onLogout}
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
