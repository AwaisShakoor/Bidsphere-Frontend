import api from "@/services/api";
import { getErrorMessage } from "@/services/Api/getErrorMessage";
import type {
  AdminAuctionDecisionResponse,
  AdminAuctionResponse,
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

export async function getAdminAuction(id: string) {
  try {
    const { data } = await api.get<AdminAuctionResponse>(
      `/api/admin/auctions/${id}`,
    );
    if (!data.data) {
      throw new Error("Auction not found");
    }
    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load auction");
  }
}

export async function approveAdminAuction(id: string) {
  try {
    const { data } = await api.post<AdminAuctionDecisionResponse>(
      `/api/admin/auctions/${id}/approve`,
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to approve auction");
  }
}

export async function rejectAdminAuction(
  id: string,
  rejectionReason: string,
) {
  try {
    const { data } = await api.post<AdminAuctionDecisionResponse>(
      `/api/admin/auctions/${id}/reject`,
      { rejectionReason },
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to reject auction");
  }
}
