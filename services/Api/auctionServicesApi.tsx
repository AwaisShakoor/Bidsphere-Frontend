import api from "@/lib/api";
import type {
  AuctionsResponse,
  CreateAuctionRequest,
  CreateAuctionResponse,
  DeleteAuctionResponse,
  GetMyAuctionsParams,
  UpdateAuctionRequest,
  UpdateAuctionResponse,
} from "@/services/types/AuctionServicesTypes";

export async function getMyAuctions(params?: GetMyAuctionsParams) {
  const { data } = await api.get<AuctionsResponse>("/api/my-auctions", {
    params,
  });
  return data.auctions;
}

export async function createAuction(auctionData: CreateAuctionRequest) {
  const { data } = await api.post<CreateAuctionResponse>(
    "/api/auctions",
    auctionData,
  );
  return data.auction;
}

export async function updateAuction(
  id: string,
  auctionData: UpdateAuctionRequest,
) {
  const { data } = await api.put<UpdateAuctionResponse>(
    `/api/auctions/${id}`,
    auctionData,
  );
  return data.auction;
}

export async function deleteAuction(id: string) {
  const { data } = await api.delete<DeleteAuctionResponse>(
    `/api/auctions/${id}`,
  );
  return data.message;
}
