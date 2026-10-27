import api from "@/services/api";
import { getErrorMessage } from "@/services/Api/getErrorMessage";
import type {
  AdminAuctionsResponse,
  AdminUsersResponse,
} from "@/services/types/AdminServicesTypes";

export async function getAdminUsers() {
  try {
    const { data } = await api.get<AdminUsersResponse>("/api/admin/users");
    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load users");
  }
}

export async function getAdminAuctions() {
  try {
    const { data } = await api.get<AdminAuctionsResponse>("/api/admin/auctions");
    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load auctions");
  }
}
