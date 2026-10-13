"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { BidSphereCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import {
  resetPasswordDefaultValues,
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";
import { useResetPassword } from "@/services/hooks/AuthServicesHook";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";

  const { mutate, isPending } = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      ...resetPasswordDefaultValues,
      email: defaultEmail,
    },
  });

  function onSubmit(values: ResetPasswordFormValues) {
    mutate(
      {
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      }
    );
  }

  const cardDescription = defaultEmail
    ? `Enter the OTP sent to ${defaultEmail} and set a new password.`
    : "Enter your email, OTP, and your new password.";

  return (
    <BidSphereCard
      title="Create new password"
      description={cardDescription}
      footerText="Remember your password?"
      footerLinkText="Log in"
      footerHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-5">
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            disabled={Boolean(defaultEmail)}
            error={errors.email}
            {...register("email")}
          />

          <Field
            label="OTP Code"
            type="text"
            placeholder="123456"
            maxLength={6}
            autoFocus={Boolean(defaultEmail)}
            error={errors.otp}
            {...register("otp")}
          />

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
