"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Gavel, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { BidSphereCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";
import {
  signUpDefaultValues,
  signUpSchema,
  type SignUpFormValues,
} from "@/lib/validations/auth";
import { useRegister } from "@/services/hooks/AuthServicesHook";
import { UserRole } from "@/enums/userRole";

const roleOptions = [
  {
    value: UserRole.BUYER,
    title: "Buyer",
    icon: Gavel,
  },
  {
    value: UserRole.SELLER,
    title: "Seller",
    icon: Store,
  },
];

export function RegisterPage() {
  const router = useRouter();
  const { mutate, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: signUpDefaultValues,
  });

  const selectedRole = watch("role");

  function onSubmit(values: SignUpFormValues) {
    mutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role,
      },
      {
        onSuccess: () =>
          router.push(`/verify-email?email=${encodeURIComponent(values.email)}`),
      },
    );
  }

  return (
    <BidSphereCard
      title="Create your account"
      description={
        selectedRole === UserRole.SELLER
          ? "Create a seller account to list items and reach buyers."
          : "Create a buyer account to discover auctions and start bidding."
      }
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-3.5">
          <fieldset className="space-y-1.5 text-left">
            <legend className="text-sm font-medium text-foreground">
              Join as
            </legend>
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted/70 p-1">
              {roleOptions.map((option) => {
                const selected = selectedRole === option.value;
                const Icon = option.icon;

                return (
                  <label
                    key={option.value}
                    className={cn(
                      "relative flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm transition-all",
                      selected
                        ? "bg-card font-medium text-foreground shadow-sm ring-1 ring-border"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="sr-only"
                      {...register("role")}
                    />
                    <Icon
                      className={cn(
                        "size-3.5 shrink-0",
                        selected ? "text-primary" : "text-muted-foreground",
                      )}
                      aria-hidden
                    />
                    <span>{option.title}</span>
                    {selected ? (
                      <Check
                        className="size-3.5 text-primary"
                        strokeWidth={3}
                        aria-hidden
                      />
                    ) : null}
                  </label>
                );
              })}
            </div>
            {errors.role?.message ? (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            ) : null}
          </fieldset>

          <div className="grid gap-3.5 sm:grid-cols-2">
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
