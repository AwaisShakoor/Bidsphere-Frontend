"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModalLock } from "@/hooks/useModalLock";

export function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string | null;
  alt?: string;
  onClose: () => void;
}) {
  useModalLock({ open: Boolean(src), onClose });

  if (!src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full image view"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 bg-background/90 shadow-sm"
        aria-label="Close image"
      >
        <X />
      </Button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? "Full size image"}
        className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
