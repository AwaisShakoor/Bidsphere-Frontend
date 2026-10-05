import api from "@/lib/api";
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  meResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/services/types/AuthServicesTypes";

export async function loginUser(body: LoginRequest) {
  const { data } = await api.post<LoginResponse>("/api/login", body);
  return data;
}

export async function registerUser(body: RegisterRequest) {
  const { data } = await api.post<RegisterResponse>("/api/register", body);
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
