import { Suspense } from "react";
import { Checkout } from "@/components/checkout/Checkout";
import { Loader } from "@/components/ui/Loader";

export default async function CheckoutItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;

  return (
    <Suspense
      fallback={<Loader label="Preparing secure checkout…" variant="orbit" />}
    >
      <Checkout itemId={itemId} />
    </Suspense>
  );
}
