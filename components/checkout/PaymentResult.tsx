"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Package, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaymentSuccess } from "@/services/hooks/PaymentServicesHook";
import { usePublicItem } from "@/services/hooks/ItemServicesHook";

type PaymentResultProps = {
  variant: "success" | "cancel";
};

export function PaymentResult({ variant }: PaymentResultProps) {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId");
  const isSuccess = variant === "success";
  usePaymentSuccess(itemId, isSuccess);
  const { data: item } = usePublicItem(itemId);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-10 sm:py-14">
      <div className="overflow-hidden rounded-2xl bg-card shadow-md shadow-primary/5 ring-1 ring-border">
        <div
          className={
            isSuccess
              ? "bg-linear-to-b from-emerald-500/12 via-card to-card px-6 pt-8 pb-6 sm:px-8"
              : "bg-linear-to-b from-muted/80 via-card to-card px-6 pt-8 pb-6 sm:px-8"
          }
        >
          <div className="flex flex-col items-center text-center">
            <span
              className={
                isSuccess
                  ? "inline-flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-300"
                  : "inline-flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border"
              }
            >
              {isSuccess ? (
                <CheckCircle2 className="size-6" aria-hidden />
              ) : (
                <XCircle className="size-6" aria-hidden />
              )}
            </span>

            <p className="mt-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {isSuccess ? "Payment" : "Checkout"}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {isSuccess ? "You’re all set" : "Payment canceled"}
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {isSuccess
                ? "Your payment went through. Track it in My payments anytime."
                : "No charge was made. You can continue checkout when you’re ready."}
            </p>
          </div>

          {itemId && item?.title ? (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-border/80 bg-background/60 px-3.5 py-3 text-left">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Item
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                  {item.title}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 border-t border-border/70 px-6 py-5 sm:px-8">
          {isSuccess ? (
            <>
              <Button type="button" className="h-10 w-full gap-1.5" asChild>
                <Link href="/my-payments">
                  My payments
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
              {itemId ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full"
                  asChild
                >
                  <Link href={`/items/${itemId}`}>View item</Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full"
                  asChild
                >
                  <Link href="/my-bids">My bids</Link>
                </Button>
              )}
            </>
          ) : (
            <>
              {itemId ? (
                <Button type="button" className="h-10 w-full gap-1.5" asChild>
                  <Link href={`/checkout/${itemId}`}>
                    Continue checkout
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full"
                asChild
              >
                <Link href={itemId ? `/items/${itemId}` : "/my-bids"}>
                  {itemId ? "Back to item" : "My bids"}
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
