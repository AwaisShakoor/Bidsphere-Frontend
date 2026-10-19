import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { Loader } from "@/components/ui/Loader";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loader variant="orbit" />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
