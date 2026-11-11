import api from "@/services/api";
import { getErrorMessage } from "@/services/Api/getErrorMessage";
import type {
  Bid,
  BidsResponse,
  MyBid,
  MyBidsResponse,
  PlaceBidRequest,
  PlaceBidResponse,
} from "@/services/types/BidServicesTypes";

export async function getItemBids(itemId: string): Promise<Bid[]> {
  try {
    const { data } = await api.get<BidsResponse>(`/api/items/${itemId}/bids`);
    return data.bids ?? [];
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load bids");
  }
}

export async function getMyBids(): Promise<MyBid[]> {
  try {
    const { data } = await api.get<MyBidsResponse>("/api/me/bids");
    return data.bids ?? [];
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load your bids");
  }
}

export async function placeBid(itemId: string, body: PlaceBidRequest) {
  try {
    const { data } = await api.post<PlaceBidResponse>(
      `/api/items/${itemId}/bids`,
      body,
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to place bid");
  }
}
