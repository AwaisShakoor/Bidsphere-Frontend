"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { BidSphereCard } from "@/components/auth/AuthCard";
import { RESET_TOKEN_KEY } from "@/components/auth/VerifyResetOtpForm";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/FormField";
import { getAuthRedirectPath } from "@/lib/auth/routes";
import {
  resetPasswordDefaultValues,
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validationSchema/authSchema";
import { useResetPassword } from "@/services/hooks/AuthServicesHook";

export function ResetPasswordForm() {
  const router = useRouter();
  const [resetToken, setResetToken] = useState<string | null>(null);
  const { mutate, isPending } = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: resetPasswordDefaultValues,
  });

  useEffect(() => {
    const token = sessionStorage.getItem(RESET_TOKEN_KEY);
    if (!token) {
      router.replace("/forgot-password");
      return;
    }
    setResetToken(token);
  }, [router]);

  function onSubmit(values: ResetPasswordFormValues) {
    if (!resetToken) {
      router.replace("/forgot-password");
      return;
    }

    mutate(
      {
        resetToken,
        newPassword: values.newPassword,
      },
      {
        onSuccess: (data) => {
          sessionStorage.removeItem(RESET_TOKEN_KEY);
          router.push(getAuthRedirectPath(data.user?.role));
        },
        onError: (error) => {
          if (!/token|expired/i.test(error.message)) return;
          sessionStorage.removeItem(RESET_TOKEN_KEY);
          router.push("/forgot-password");
        },
      },
    );
  }

  if (!resetToken) return null;

  return (
    <BidSphereCard
      title="Create new password"
      description="Enter your new password to finish resetting your account."
      footerText="Remember your password?"
      footerLinkText="Log in"
      footerHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-5">
          <Field
            label="New Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={errors.newPassword}
            {...register("newPassword")}
          />

          <Field
            label="Confirm New Password"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            error={errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full text-sm font-medium"
          disabled={isPending}
        >
          {isPending ? "Resetting password..." : "Reset Password"}
        </Button>
      </form>
    </BidSphereCard>
  );
}
