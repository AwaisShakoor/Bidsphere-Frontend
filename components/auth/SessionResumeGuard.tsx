"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionResumeDialog } from "@/components/auth/SessionResumeDialog";
import {
  clearSessionActivity,
  isSessionAway,
  touchSessionActivity,
} from "@/lib/auth/sessionActivity";
import { useLogout, useMe } from "@/services/hooks/AuthServicesHook";

export function SessionResumeGuard() {
  const router = useRouter();
  const { data, isSuccess } = useMe();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const loggedIn = isSuccess && Boolean(data?.user);

  useEffect(() => {
    if (!loggedIn) return;

    // Seed timestamp once if missing (e.g. first load after login)
    if (!localStorage.getItem("bidsphere:lastActiveAt")) {
      touchSessionActivity();
    }

    function check() {
      if (isSessionAway()) setOpen(true);
    }

    check();
    const id = window.setInterval(check, 5_000);
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);

    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [loggedIn]);

  return (
    <SessionResumeDialog
      open={open}
      isLoggingOut={logout.isPending}
      onStayLoggedIn={() => {
        touchSessionActivity();
        setOpen(false);
      }}
      onLogout={() => {
        logout.mutate(undefined, {
          onSuccess: () => {
            clearSessionActivity();
            setOpen(false);
            router.push("/login");
          },
        });
      }}
    />
  );
}
