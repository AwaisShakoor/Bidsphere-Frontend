import { Suspense } from "react";
import { PaymentResult } from "@/components/checkout/PaymentResult";
import { Loader } from "@/components/ui/Loader";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loader variant="orbit" />}>
      <PaymentResult variant="success" />
    </Suspense>
  );
}
