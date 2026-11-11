"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImageLightbox } from "@/components/item/ImageLightbox";
import { PublicItemBidHistory } from "./PublicItemBidHistory";
import { PublicItemDetailSkeleton } from "./PublicItemDetailSkeleton";
import { PublicItemGallery } from "./PublicItemGallery";
import { PublicItemInfo } from "./PublicItemInfo";
import { Button } from "@/components/ui/button";
import { getAuthRedirectPath } from "@/lib/auth/routes";
import { useMe } from "@/services/hooks/AuthServicesHook";
import { usePublicItem } from "@/services/hooks/ItemServicesHook";

export function PublicItemDetail({ itemId }: { itemId: string }) {
  const { data: meData, isPending: isMePending } = useMe();
  const { data: item, isPending, isError, error } = usePublicItem(itemId);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const user = meData?.user;
  const backHref = user ? getAuthRedirectPath(user.role) : "/";

  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-linear-to-b from-primary/12 via-accent/40 to-transparent"
      />

      <div className="app-container relative flex flex-col gap-6 py-8 sm:gap-8 sm:py-10">
        <Button
          type="button"
          variant="ghost"
          asChild
          className="w-fit text-muted-foreground hover:text-foreground"
        >
          <Link href={backHref}>
            <ArrowLeft data-icon="inline-start" />
            {user ? "Back to dashboard" : "Back to items"}
          </Link>
        </Button>

        {isPending ? (
          <PublicItemDetailSkeleton />
        ) : isError ? (
          <p className="text-sm text-destructive">{error.message}</p>
        ) : !item ? null : (
          <>
            <section className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/10 ring-1 ring-primary/20">
              <div className="grid lg:grid-cols-2">
                <PublicItemGallery item={item} onPreview={setPreviewUrl} />
                <PublicItemInfo
                  item={item}
                  itemId={itemId}
                  userId={user?.id ?? null}
                  isLoggedIn={Boolean(user)}
                  isAuthPending={isMePending}
                />
              </div>
            </section>

            <PublicItemBidHistory itemId={itemId} />
          </>
        )}
      </div>

      <ImageLightbox
        src={previewUrl}
        alt={item?.title}
        onClose={() => setPreviewUrl(null)}
      />
    </main>
  );
}
