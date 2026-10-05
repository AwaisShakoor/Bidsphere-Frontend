"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

import { loginUser, logoutUser, registerUser } from "@/services/Api/AuthApiServices";
import type {
  LoginRequest,
  RegisterRequest,
} from "@/services/types/AuthServicesTypes";

export function useLogin() {
  return useMutation({
    mutationFn: (body: LoginRequest) => loginUser(body),
    onSuccess: (data) => {
      toast.success("User login successfully" || data.message);
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
