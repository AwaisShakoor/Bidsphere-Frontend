"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Toaster, ToastBar, toast } from "react-hot-toast";
import { queryClient } from "./queryClient";

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right">
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" ? (
                  <button
                    type="button"
                    onClick={() => toast.dismiss(t.id)}
                    className="ml-2 cursor-pointer rounded p-0.5 text-sm leading-none opacity-60 transition hover:opacity-100"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                ) : null}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </QueryClientProvider>
  );
}
