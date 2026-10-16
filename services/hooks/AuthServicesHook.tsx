"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CacheKeys } from "@/enums/cacheKeys";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import {
  forgotPassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyEmail,
} from "@/services/Api/AuthServicesApi";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from "@/services/types/AuthServicesTypes";

export function useLogin() {
  return useMutation({
    mutationFn: (body: LoginRequest) => loginUser(body),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Invalid email or password"));
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (body: RegisterRequest) => registerUser(body),
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Registration failed. Try again."));
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (body: VerifyEmailRequest) => verifyEmail(body),
    onSuccess: (data) => {
      toast.success(data.message || "Email verified successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Invalid or expired OTP"));
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: ForgotPasswordRequest) => forgotPassword(body),
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to send OTP. Try again."));
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (body: ResetPasswordRequest) => resetPassword(body),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to reset password"));
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      toast.success(data.message || "Logged out successfully!");
      queryClient.removeQueries({ queryKey: [CacheKeys.ME] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Logout failed"));
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: [CacheKeys.ME],
    queryFn: getMe,
    retry: false,
  });
}
