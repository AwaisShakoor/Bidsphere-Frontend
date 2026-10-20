import api from "@/services/api";
import { getErrorMessage } from "@/services/Api/getErrorMessage";
import type {
  AuctionResponse,
  AuctionsResponse,
  CreateAuctionRequest,
  CreateAuctionResponse,
  DeleteAuctionResponse,
  SubmitAuctionResponse,
  UpdateAuctionRequest,
  UpdateAuctionResponse,
} from "@/services/types/AuctionServicesTypes";

export async function getAuctions() {
  try {
    const { data } = await api.get<AuctionsResponse>("/api/auctions");
    return data.auctions;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load auctions");
  }
}

export async function getAuction(id: string) {
  try {
    const { data } = await api.get<AuctionResponse>(`/api/auctions/${id}`);
    return data.auction;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load auction");
  }
}

export async function createAuction(body: CreateAuctionRequest) {
  try {
    const { data } = await api.post<CreateAuctionResponse>("/api/auctions", body);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to create auction");
  }
}

export async function updateAuction({ id, ...body }: UpdateAuctionRequest) {
  try {
    const { data } = await api.put<UpdateAuctionResponse>(
      `/api/auctions/${id}`,
      body,
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to update auction");
  }
}

export async function deleteAuction(id: string) {
  try {
    const { data } = await api.delete<DeleteAuctionResponse>(
      `/api/auctions/${id}`,
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to delete auction");
  }
}

export async function submitAuction(id: string) {
  try {
    const { data } = await api.post<SubmitAuctionResponse>(
      `/api/auctions/${id}/submit`,
    );
    return data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error) || "Failed to submit auction for approval",
    );
  }
}
