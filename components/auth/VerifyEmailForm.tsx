"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { BidSphereCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import {
  verifyEmailDefaultValues,
  verifyEmailSchema,
  type VerifyEmailFormValues,
} from "@/lib/validationSchema/authSchema";
import { getAuthRedirectPath } from "@/lib/auth/routes";
import { cn } from "@/lib/utils";
import {
  useResendVerificationOtp,
  useVerifyEmail,
} from "@/services/hooks/AuthServicesHook";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const { mutate, isPending } = useVerifyEmail();
  const { mutate: resendOtp, isPending: isResending } =
    useResendVerificationOtp();
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      ...verifyEmailDefaultValues,
      email,
    },
  });

  const otp = watch("otp") || "";

  useEffect(() => {
    if (!email) {
      router.replace("/register");
      return;
    }
    setValue("email", email);
  }, [email, router, setValue]);

  function onSubmit(values: VerifyEmailFormValues) {
    mutate(values, {
      onSuccess: (data) => {
        router.push(getAuthRedirectPath(data.user?.role));
      },
    });
  }

  function handleResendOtp() {
    if (!email || isResending) return;
    resendOtp({ email });
  }

  if (!email) return null;

  return (
    <BidSphereCard
      title="Verify your email"
      description="Enter the 6-digit verification code we sent to your email."
      footerText="Back to"
      footerLinkText="Log in"
      footerHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                ref={(node) => {
                  inputsRef.current[index] = node;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index] || ""}
                disabled={isPending || isResending}
                autoFocus={index === 0}
                aria-invalid={Boolean(errors.otp)}
                onChange={(event) => {
                  const digit = event.target.value.replace(/\D/g, "").slice(-1);
                  const next = otp.padEnd(6, " ").split("");
                  next[index] = digit;
                  setValue("otp", next.join("").replace(/\s/g, ""), {
                    shouldValidate: true,
                  });
                  if (digit && index < 5) inputsRef.current[index + 1]?.focus();
                }}
                onPaste={(event) => {
                  event.preventDefault();
                  const pasted = event.clipboardData
                    .getData("text")
                    .replace(/\D/g, "")
                    .slice(0, 6);
                  if (!pasted) return;
                  setValue("otp", pasted, { shouldValidate: true });
                  inputsRef.current[Math.min(pasted.length, 5)]?.focus();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !otp[index] && index > 0) {
                    inputsRef.current[index - 1]?.focus();
                  }
                }}
                className={cn(
                  "h-12 w-10 rounded-lg border border-input bg-transparent text-center text-lg font-semibold outline-none sm:h-14 sm:w-12",
                  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  errors.otp && "border-destructive",
                )}
              />
            ))}
          </div>
          {errors.otp?.message ? (
            <p className="text-center text-sm text-destructive">
              {errors.otp.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            size="lg"
            className="h-11 w-full text-sm font-medium"
            disabled={isPending || isResending}
          >
            {isPending ? "Verifying..." : "Verify OTP"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-10 w-full text-sm font-medium"
            disabled={isPending || isResending}
            onClick={handleResendOtp}
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </Button>
        </div>
      </form>
    </BidSphereCard>
  );
}
