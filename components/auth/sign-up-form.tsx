"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { BidSphereCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import {
  signUpDefaultValues,
  signUpSchema,
  type SignUpFormValues,
} from "@/lib/validations/auth";
import { useRegister } from "@/services/hooks/AuthServicesHook";

export function RegisterPage() {
  const router = useRouter();
  const { mutate, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: signUpDefaultValues,
  });

  function onSubmit(values: SignUpFormValues) {
    mutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => router.push(`/verify-email?email=${encodeURIComponent(values.email)}`),
      },
    );
  }

  return (
    <BidSphereCard
      title="Create your account"
      description="Join BidSphere to discover auctions and start bidding today."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="First name"
              type="text"
              autoComplete="given-name"
              placeholder="First Name"
              error={errors.firstName}
              {...register("firstName")}
            />
            <Field
              label="Last name"
              type="text"
              autoComplete="family-name"
              placeholder="Last Name"
              error={errors.lastName}
              {...register("lastName")}
            />
          </div>
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            error={errors.email}
            {...register("email")}
          />
          <Field
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={errors.password}
            {...register("password")}
          />
          <Field
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
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
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </BidSphereCard>
  );
}
