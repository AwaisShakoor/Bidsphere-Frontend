"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
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
      toast.success(data.message || "User login successfully");
    },
    onError: (error) => {
      toast.error(getAuthErrorMessage(error, "Invalid email or password"));
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (body: RegisterRequest) => registerUser(body),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(getAuthErrorMessage(error));
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
      toast.error(getAuthErrorMessage(error));
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: ForgotPasswordRequest) => forgotPassword(body),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset OTP sent to your email");
    },
    onError: (error) => {
      toast.error(getAuthErrorMessage(error));
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
      toast.error(getAuthErrorMessage(error));
    },
  });
}



export function useLogout() {
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(getAuthErrorMessage(error));
    },
  });
}

function getAuthErrorMessage(error: unknown, frontendMessage?: string) {
  if (frontendMessage) return frontendMessage;

  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Something went wrong. Try again.";
  }

  return "Something went wrong. Try again.";
}

export function useMe() {
  return useQuery({
    queryKey: ["/api/me"],
    queryFn: getMe,
  });
}
