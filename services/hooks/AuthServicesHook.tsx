"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

import {
  forgotPassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyEmail,
} from "@/services/Api/AuthApiServices";
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
      toast.error(getAuthErrorMessage(error));
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
      toast.error(getAuthErrorMessage(error, "Registration failed. Try again."));
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
      toast.error(getAuthErrorMessage(error, "Invalid or expired OTP"));
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
      toast.error(getAuthErrorMessage(error, "Failed to send OTP. Try again."));
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
      toast.error(getAuthErrorMessage(error, "Failed to reset password"));
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      toast.success(data.message || "Logged out successfully!");
      queryClient.removeQueries({ queryKey: ["/api/me"] });
    },
    onError: (error) => {
      toast.error(getAuthErrorMessage(error, "Logout failed"));
    },
  });
}

function getAuthErrorMessage(error: unknown, fallbackMessage?: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallbackMessage || "Something went wrong. Try again.";
  }

  return fallbackMessage || "Something went wrong. Try again.";
}

export function useMe() {
  return useQuery({
    queryKey: ["/api/me"],
    queryFn: getMe,
    retry: false,
  });
}
