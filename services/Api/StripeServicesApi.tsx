import api from "@/services/apiClient";
import { getErrorMessage } from "@/services/Api/getErrorMessage";
import type {
  StripeBalance,
  StripeBalanceResponse,
  StripeConnectResponse,
  StripeConnectResult,
  StripeConnectionStatus,
  StripeStatusResponse,
  StripeWithdrawResponse,
} from "@/services/types/StripeServicesTypes";

export async function getStripeStatus(): Promise<StripeConnectionStatus> {
  try {
    const { data } = await api.get<StripeStatusResponse>(
      "/api/me/stripe/status",
    );
    return data.result;
  } catch (error) {
    throw new Error(
      getErrorMessage(error) || "Failed to load Stripe connection status",
    );
  }
}

export async function getStripeBalance(): Promise<StripeBalance> {
  try {
    const { data } = await api.get<StripeBalanceResponse>(
      "/api/me/stripe/balance",
    );
    return data.result;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load Stripe balance");
  }
}

export async function createStripeConnect(): Promise<StripeConnectResult> {
  try {
    const { data } = await api.post<StripeConnectResponse>(
      "/api/me/stripe/connect",
    );
    return data.result;
  } catch (error) {
    throw new Error(
      getErrorMessage(error) || "Failed to start Stripe connection",
    );
  }
}

export async function createStripeWithdraw(
  amount: number,
): Promise<StripeWithdrawResponse> {
  try {
    const { data } = await api.post<StripeWithdrawResponse>(
      "/api/me/stripe/withdraw",
      { amount },
    );
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to start withdrawal");
  }
}
