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

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type ResetPasswordRequest = {
  email: string;
  otp: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  message: string;
};

