"use client";

import { useEffect } from "react";

export function useModalLock({
  open,
  onClose,
  enabled = true,
}: {
  open: boolean;
  onClose: () => void;
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && enabled) onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, enabled]);
}
