import { UserRole } from "@/enums/userRole";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  user: User;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Exclude<UserRole, UserRole.ADMIN>;
};

export type RegisterResponse = {
  message: string;
  user: User;
};

export type LogoutResponse = {
  message: string;
};

export type meResponse = {
  message: string;
  user: User;
};

export type VerifyEmailRequest = {
  email: string;
  otp: string;
};

export type VerifyEmailResponse = {
  message: string;
  user?: User;
};

export type ResendVerificationOtpRequest = {
  email: string;
};

export type ResendVerificationOtpResponse = {
  message: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type VerifyResetOtpRequest = {
  email: string;
  otp: string;
};

export type VerifyResetOtpResponse = {
  message: string;
  resetToken: string;
};

export type ResetPasswordRequest = {
  resetToken: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  message: string;
  user?: User;
};

