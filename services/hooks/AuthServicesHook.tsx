"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "@/components/providers/queryProvider/queryClient";
import { CacheKeys } from "@/enums/cacheKeys";
import {
  clearSessionActivity,
  touchSessionActivity,
} from "@/lib/auth/sessionActivity";
import {
  forgotPassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationOtp,
  resetPassword,
  verifyEmail,
  verifyResetOtp,
} from "@/services/Api/AuthServicesApi";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResendVerificationOtpRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  VerifyResetOtpRequest,
} from "@/services/types/AuthServicesTypes";

export function useLogin() {
  return useMutation({
    mutationFn: (body: LoginRequest) => loginUser(body),
    onSuccess: (data) => {
      toast.success(data.message);
      touchSessionActivity();
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ME] });
    },
    onError: (error) => {
      toast.error(error.message);
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
      toast.error(error.message);
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (body: VerifyEmailRequest) => verifyEmail(body),
    onSuccess: (data) => {
      toast.success(data.message || "Email verified successfully!");
      touchSessionActivity();
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ME] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useResendVerificationOtp() {
  return useMutation({
    mutationFn: (body: ResendVerificationOtpRequest) =>
      resendVerificationOtp(body),
    onSuccess: (data) => {
      toast.success(data.message || "Resend OTP sent successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
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
      toast.error(error.message);
    },
  });
}

export function useVerifyResetOtp() {
  return useMutation({
    mutationFn: (body: VerifyResetOtpRequest) => verifyResetOtp(body),
    onSuccess: (data) => {
      toast.success(data.message || "OTP verified successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (body: ResetPasswordRequest) => resetPassword(body),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully!");
      queryClient.invalidateQueries({ queryKey: [CacheKeys.ME] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      toast.success(data.message || "Logged out successfully!");
      clearSessionActivity();
      queryClient.removeQueries({ queryKey: [CacheKeys.ME] });
    },
    onError: (error) => {
      toast.error(error.message);
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
