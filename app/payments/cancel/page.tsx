import { Suspense } from "react";
import { PaymentResult } from "@/components/checkout/PaymentResult";
import { Loader } from "@/components/ui/Loader";

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<Loader variant="orbit" />}>
      <PaymentResult variant="cancel" />
    </Suspense>
  );
}
