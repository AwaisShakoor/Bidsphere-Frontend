"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { BidSphereCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import {
  forgotPasswordDefaultValues,
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";
import { useForgotPassword } from "@/services/hooks/AuthServicesHook";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { mutate, isPending } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordDefaultValues,
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    mutate(values, {
      onSuccess: () => {
        router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
      },
    });
  }

  return (
    <BidSphereCard
      title="Reset your password"
      description="Enter your email and we'll send you an OTP to reset your password."
      footerText="Remember your password?"
      footerLinkText="Log in"
      footerHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          error={errors.email}
          {...register("email")}
        />

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full text-sm font-medium"
          disabled={isPending}
        >
          {isPending ? "Sending OTP..." : "Send Reset OTP"}
        </Button>
      </form>
    </BidSphereCard>
  );
}

