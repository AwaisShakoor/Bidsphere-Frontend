import api from "@/services/api";
import { getErrorMessage } from "@/services/api/getErrorMessage";
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  meResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/services/types/AuthServicesTypes";

export async function loginUser(body: LoginRequest) {
  try {
    const { data } = await api.post<LoginResponse>("/api/login", body);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Invalid email or password");
  }
}

export async function registerUser(body: RegisterRequest) {
  try {
    const { data } = await api.post<RegisterResponse>("/api/register", body);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Registration failed. Try again.");
  }
}

export async function verifyEmail(body: VerifyEmailRequest) {
  try {
    const { data } = await api.post<VerifyEmailResponse>("/api/verify-email", body);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Invalid or expired OTP");
  }
}

export async function forgotPassword(body: ForgotPasswordRequest) {
  try {
    const { data } = await api.post<ForgotPasswordResponse>("/api/forgot-password", body);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to send OTP. Try again.");
  }
}

export async function resetPassword(body: ResetPasswordRequest) {
  try {
    const { data } = await api.post<ResetPasswordResponse>("/api/reset-password", body);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to reset password");
  }
}

export async function logoutUser() {
  try {
    const { data } = await api.delete<LogoutResponse>("/api/logout");
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Logout failed");
  }
}

export async function getMe() {
  try {
    const { data } = await api.get<meResponse>("/api/me");
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load your account");
  }
}

export async function refreshToken() {
  try {
    const { data } = await api.post("/api/refresh");
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to refresh session");
  }
}
