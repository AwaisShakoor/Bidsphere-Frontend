import api from "@/lib/api";
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
  const { data } = await api.post<LoginResponse>("/api/login", body);
  return data;
}

export async function registerUser(body: RegisterRequest) {
  const { data } = await api.post<RegisterResponse>("/api/register", body);
  return data;
}

export async function verifyEmail(body: VerifyEmailRequest) {
  const { data } = await api.post<VerifyEmailResponse>("/api/verify-email", body);
  return data;
}

export async function forgotPassword(body: ForgotPasswordRequest) {
  const { data } = await api.post<ForgotPasswordResponse>("/api/forgot-password", body);
  return data;
}

export async function resetPassword(body: ResetPasswordRequest) {
  const { data } = await api.post<ResetPasswordResponse>("/api/reset-password", body);
  return data;
}



export async function logoutUser() {
  const { data } = await api.delete<LogoutResponse>("/api/logout");
  return data;
}

export async function getMe() {
  const { data } = await api.get<meResponse>("/api/me");
  return data;
}
