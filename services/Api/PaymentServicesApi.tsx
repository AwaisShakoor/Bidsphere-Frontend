import axios from "axios";
import api from "@/services/api";
import { getErrorMessage } from "@/services/Api/getErrorMessage";
import type {
  CreateCheckoutResponse,
  ItemPaymentResponse,
  MyPaymentsResponse,
  Payment,
} from "@/services/types/PaymentServicesTypes";

export async function createCheckout(
  itemId: string,
): Promise<CreateCheckoutResponse> {
  try {
    const { data } = await api.post<CreateCheckoutResponse>(
      `/api/payments/items/${itemId}/checkout`,
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to start checkout");
  }
}

export async function getItemPayment(
  itemId: string,
): Promise<Payment | null> {
  try {
    const { data } = await api.get<ItemPaymentResponse>(
      `/api/payments/items/${itemId}`,
    );
    return data.payment ?? null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw new Error(getErrorMessage(error) || "Failed to load payment");
  }
}

export async function getMyPayments(): Promise<Payment[]> {
  try {
    const { data } = await api.get<MyPaymentsResponse>("/api/me/payments");
    return data.payments ?? [];
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load payments");
  }
}
