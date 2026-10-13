import { z } from "zod";
import { UserRole } from "@/enums/userRole";

const emailField = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address");

const passwordField = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters");

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const userRoleSchema = z.enum([UserRole.BUYER, UserRole.SELLER], {
  message: "Please select buyer or seller",
});

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: userRoleSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const verifyEmailSchema = z.object({
  email: emailField,
  otp: z.string().min(1, "OTP is required").length(6, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z
  .object({
    email: emailField,
    otp: z.string().min(1, "OTP is required").length(6, "OTP must be 6 digits"),
    newPassword: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const loginDefaultValues: LoginFormValues = {
  email: "",
  password: "",
};

export const forgotPasswordDefaultValues: ForgotPasswordFormValues = {
  email: "",
};

export const verifyEmailDefaultValues: VerifyEmailFormValues = {
  email: "",
  otp: "",
};

export const resetPasswordDefaultValues: ResetPasswordFormValues = {
  email: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
};


export const signUpDefaultValues: SignUpFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: UserRole.BUYER,
};

