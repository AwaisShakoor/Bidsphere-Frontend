"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaymentSuccess } from "@/services/hooks/PaymentServicesHook";

type PaymentResultProps = {
  variant: "success" | "cancel";
};

export function PaymentResult({ variant }: PaymentResultProps) {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId");
  usePaymentSuccess(itemId, variant === "success");

  if (variant === "success") {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-5 px-4 py-16 text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-300">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Payment complete
          </h1>
          <p className="text-sm text-muted-foreground">
            Your payment was successful. You can review it anytime in Payments.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button type="button" asChild>
            <Link href="/my-payments">View payments</Link>
          </Button>
          {itemId ? (
            <Button type="button" variant="outline" asChild>
              <Link href={`/items/${itemId}`}>View item</Link>
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-5 px-4 py-16 text-center">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
        <XCircle className="size-7" aria-hidden />
      </span>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Payment canceled
        </h1>
        <p className="text-sm text-muted-foreground">
          No charge was made. You can resume checkout whenever you’re ready.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {itemId ? (
          <Button type="button" asChild>
            <Link href={`/checkout/${itemId}`}>Continue checkout</Link>
          </Button>
        ) : null}
        <Button type="button" variant="outline" asChild>
          <Link href={itemId ? `/items/${itemId}` : "/my-bids"}>
            {itemId ? "Back to item" : "My bids"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
