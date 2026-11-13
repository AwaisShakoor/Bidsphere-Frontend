import { Suspense } from "react";
import { VerifyResetOtpForm } from "@/components/auth/VerifyResetOtpForm";
import { Loader } from "@/components/ui/Loader";

export default function VerifyResetOtpPage() {
  return (
    <Suspense fallback={<Loader variant="orbit" />}>
      <VerifyResetOtpForm />
    </Suspense>
  );
}
