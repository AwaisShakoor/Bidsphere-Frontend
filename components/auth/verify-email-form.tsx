"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { BidSphereCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import {
  verifyEmailDefaultValues,
  verifyEmailSchema,
  type VerifyEmailFormValues,
} from "@/lib/validations/auth";
import { useVerifyEmail } from "@/services/hooks/AuthServicesHook";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";

  const { mutate, isPending } = useVerifyEmail();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      ...verifyEmailDefaultValues,
      email: defaultEmail,
    },
  });

  function onSubmit(values: VerifyEmailFormValues) {
    mutate(values, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  }

  const cardDescription = defaultEmail
    ? `We sent a 6-digit OTP verification code to ${defaultEmail}.`
    : "Enter your email address and the 6-digit OTP code sent to your email.";

  return (
    <BidSphereCard
      title="Verify your email"
      description={cardDescription}
      footerText="Back to"
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
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full text-sm font-medium"
          disabled={isPending}
        >
          {isPending ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>
    </BidSphereCard>
  );
}
