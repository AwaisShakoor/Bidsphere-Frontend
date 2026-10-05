"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { BidSphereCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import {
  loginDefaultValues,
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth";
import { useLogin } from "@/services/hooks/AuthServicesHook";

export function LoginForm() {
  const { mutate, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  function onSubmit(values: LoginFormValues) {
    mutate(values);
  }

  return (
    <BidSphereCard
      title="BidSphere"
      description="Log in to bid on live auctions and manage your account."
      footerText="Don't have an account?"
      footerLinkText="Register"
      footerHref="/register"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-5">
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email}
            {...register("email")}
          />
          <Field
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password}
            {...register("password")}
          />
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full text-sm font-medium"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </BidSphereCard>
  );
}
