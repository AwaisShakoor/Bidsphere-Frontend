"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/Loader";
import { createCheckout } from "@/services/Api/PaymentServicesApi";

type CheckoutPageProps = {
  itemId: string;
};

export function CheckoutPage({ itemId }: CheckoutPageProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const result = await createCheckout(itemId);
        if (cancelled) return;

        if (!result.url) {
          setError("We couldn’t start checkout. Please try again.");
          setIsLoading(false);
          return;
        }

        window.location.assign(result.url);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "We couldn’t start checkout. Please try again.",
          );
          setIsLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  if (isLoading) {
    return <Loader label="Preparing secure checkout…" variant="orbit" />;
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-start gap-4 px-4 py-10">
      <h1 className="text-xl font-semibold text-foreground">
        Checkout unavailable
      </h1>
      <p className="text-sm text-destructive">
        {error || "Something went wrong while starting checkout."}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" asChild>
          <Link href={`/checkout/${itemId}`}>Try again</Link>
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={`/items/${itemId}`}>Back to item</Link>
        </Button>
      </div>
    </div>
  );
}
