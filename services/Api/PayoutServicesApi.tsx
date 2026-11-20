import api from "@/services/apiClient";
import { getErrorMessage } from "@/services/Api/getErrorMessage";
import type {
  MyPayoutsResponse,
  SellerPayout,
} from "@/services/types/PayoutServicesTypes";

export async function getMyPayouts(): Promise<SellerPayout[]> {
  try {
    const { data } = await api.get<MyPayoutsResponse>("/api/me/payouts");
    return data.payouts ?? [];
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load payouts");
  }
}
