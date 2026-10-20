import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Loader } from "@/components/ui/Loader";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader variant="orbit" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
