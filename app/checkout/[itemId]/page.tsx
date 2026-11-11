import { Suspense } from "react";
import { CheckoutPage } from "@/components/checkout/CheckoutPage";
import { Loader } from "@/components/ui/Loader";

export default async function CheckoutItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;

  return (
    <Suspense fallback={<Loader label="Preparing secure checkout…" variant="orbit" />}>
      <CheckoutPage itemId={itemId} />
    </Suspense>
  );
}
